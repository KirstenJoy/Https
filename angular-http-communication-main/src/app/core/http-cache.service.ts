import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    provideedin: 'root'
})

export class HttpCacheService{
    put(url: string, event: HttpResponse<any>) {
        throw new Error("Method not implemented.");
    }
    private requests: any ={};
    constructor(){}

    pu(url:string, response: HttpResponse<any>): void {
        this.requests[url] = response;
    }

    get(url:string): HttpResponse<any> | undefined {
        return this.requests[url];
    }

    invalidateUrl(url:string): void {
        this.requests[url] = undefined;
    }
    
    invalidateCache(): void{
        this.requests = {};
    }
}