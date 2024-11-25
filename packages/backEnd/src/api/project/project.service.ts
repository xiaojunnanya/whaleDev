import { Injectable } from '@nestjs/common'
import { createProjectDto } from './dto/project.dto'
import { v4 as uuidv4 } from 'uuid'
import { customResponse } from '@/interceptor/response.interceptor'
import { PrismaService } from '@/global/mysql/prisma.service'
import { StoreService } from '@/global/store/store.service'
// 遗留的问题：权限控制，其他用户不能获取用删除处理，这里目前用的user_id做的判断，需要优化，只是返回了报错
@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly store: StoreService,
  ) {}

  private readonly selectData = {
    id: true,
    project_id: true,
    project_name: true,
    project_desc: true,
    project_type: true,
    project_state: true,
  }

  async createProject(data: createProjectDto) {
    const u = uuidv4()
    const project_id = `pj${u.split('-')[0]}`
    await this.prisma.project.create({
      data: {
        user_id: this.store.get('user_id'),
        project_id,
        project_name: data.project_name,
        project_desc: data.project_desc,
        project_type: data.project_type,
        project_state: data.project_state,
      },
    })

    return customResponse(0, '创建成功', 'success')
  }

  async getProjectList(page: number) {
    // 优化查询，避免查询两次:使用聚合查询
    const user_id = this.store.get('user_id')
    console.log(this.selectData, 'this.selectData')
    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where: {
          user_id,
          status: 0,
        },
        orderBy: { created_time: 'desc' },
        select: this.selectData,
        skip: (page - 1) * 8,
        take: 8,
      }),
      this.prisma.project.count({
        where: {
          user_id,
          status: 0,
        },
      }),
    ])

    return customResponse(0, '获取成功', 'success', {
      data,
      total,
    })
  }

  async searchProject(keyword: string, page: number) {
    const user_id = this.store.get('user_id')
    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where: {
          user_id,
          status: 0,
          project_name: {
            contains: keyword, // 包含
          },
        },
        orderBy: { created_time: 'desc' },
        select: this.selectData,
        skip: (page - 1) * 8,
        take: 8,
      }),
      this.prisma.project.count({
        where: {
          user_id,
          status: 0,
          project_name: {
            contains: keyword, // 包含
          },
        },
      }),
    ])

    return customResponse(0, '获取成功', 'success', {
      data,
      total,
    })
  }

  async deleteProject(id: number) {
    const user_id = this.store.get('user_id')
    await this.prisma.project.update({
      where: {
        user_id,
        id: id,
        status: 0,
      },
      data: {
        status: 1,
      },
    })

    return customResponse(0, '删除成功', 'success')
  }

  async updateProject(id: number, data: createProjectDto) {
    const user_id = this.store.get('user_id')
    await this.prisma.project.update({
      where: {
        id: id,
        user_id,
        status: 0,
      },
      data: {
        project_name: data.project_name,
        project_desc: data.project_desc,
        project_type: data.project_type,
        project_state: data.project_state,
      },
    })

    return customResponse(0, '更新成功', 'success')
  }

  async getProjectDetail(id: string) {
    const user_id = this.store.get('user_id')
    const data = await this.prisma.project.findUnique({
      where: {
        project_id: id,
        user_id,
        status: 0,
      },
      select: this.selectData,
    })

    return customResponse(0, '查询成功', 'success', data)
  }
}
