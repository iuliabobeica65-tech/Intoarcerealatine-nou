import {handle} from '../../infrastructure/api.mjs';
export const onRequest=({request,env})=>handle(request,env);
