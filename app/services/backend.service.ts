import { Injectable } from "@angular/core";
import { getString, setString } from "application-settings";

const tokenKey = "token";

export class BackendService {
  
  //public static token:string;
  public static email:string;

  /*public static isLoggedIn(): boolean {
    return !!BackendService.token;
  }

  public static getToken():any {
    return BackendService.token;
  }
    
  public static hasActiveToken():any {
    return !!BackendService.token;
  }*/

  static isLoggedIn(): boolean {
    return !!getString("token");
  }

  static get token(): string {
    return getString("token");
  }

  static set token(theToken: string) {
    setString("token", theToken);
  }


  static invalidateToken() {
    BackendService.token = "";
    BackendService.email = "";
  }

}
