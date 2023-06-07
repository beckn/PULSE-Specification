import { DomainNotFoundException } from "../odr/exception/domain-notFound.exception";
import { DisputeAPIService } from "../odr/dispute.service";

import { Injectable } from "@nestjs/common";

import { SearchApiInterface } from "../odr/odr-api.interface";
import { OdrTypeEnum } from "../odr/odr-type.enum";

@Injectable()
export class MobilityService {
    get(domain: string): SearchApiInterface {
        switch (domain) {
            case OdrTypeEnum.dispute:
                return new DisputeAPIService();
            default:
                throw new DomainNotFoundException();
        }
    }
}