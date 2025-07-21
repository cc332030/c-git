

declare interface Server {

  /**
   * git 服务地址
   */
  host: string;

  /**
   * 授权用户名
   */
  username: string;

  /**
   * 授权 Token
   */
  token: string;

  /**
   * git 服务类型
   */
  type: string;

}

declare interface Config {

  /**
   * 仓库路径
   */
  path: string;

  /**
   * git 服务信息
   */
  servers: Array<Server>;

}
