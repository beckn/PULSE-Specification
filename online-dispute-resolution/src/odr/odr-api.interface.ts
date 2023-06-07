import { searchRequestDTO } from "../odr/dto/search.request";

export interface SearchApiInterface {
    search: (SearchRequestDto: searchRequestDTO) => any;
}
