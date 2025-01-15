import { Inject, Injectable } from "@nestjs/common";
import { RedisUtil } from "./RedisUtil";

@Injectable()
export class RedisComment {
    /**
     * 
     */
    constructor(@Inject('RedisService') private readonly redisUtil: RedisUtil<any>) { };

    // 完善用户信息
    public saveUserInfo(token: string, userInfo: any) {
        this.redisUtil.set(token, userInfo);
    }
}