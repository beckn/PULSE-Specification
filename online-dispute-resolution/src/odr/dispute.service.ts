import { SearchApiInterface } from "../odr/odr-api.interface";
import { searchRequestDTO } from "./dto/search.request";
import * as searchResponse from "../odr/responses/search.response.json"

import { Injectable } from "@nestjs/common";

@Injectable()
export class DisputeAPIService implements SearchApiInterface {
    search = function (searchRequest: searchRequestDTO) {
        return searchResponse;
      };
}
