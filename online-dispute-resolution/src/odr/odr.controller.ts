import { Body, Controller, Post } from '@nestjs/common';
import { searchRequestDTO } from '../odr/dto/search.request';
import * as searchresponse from '../odr/responses/search.response.json';

@Controller('odr')
export class OdrControllerJsController {
    @Post("/search")
    search(@Body() searchDto:searchRequestDTO){
        return searchresponse;
    }
}