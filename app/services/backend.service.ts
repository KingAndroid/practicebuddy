
export class BackendService {
  
  public static token:string;
  public static email:string;

  public static isLoggedIn(): boolean {
    return !!BackendService.token;
  }

  public static getToken():any {
    return BackendService.token;
  }
    
  public static hasActiveToken():any {
    return !!BackendService.token;
  }

  public static invalidateToken() {
    BackendService.token = "";
    BackendService.email = "";
  }

}
