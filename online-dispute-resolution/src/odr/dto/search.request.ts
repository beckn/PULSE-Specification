export class searchRequestDTO{
    context: {
        domain: "nic2004:52110";
        country: "IND";
        city: "std:080";
        action: "search";
        core_version: "0.9.1";
        bap_id: "https://mock_bap.com/";
        bap_uri: "https://mock_bap.com/beckn/";
        transaction_id: "1209849124";
        message_id: "12341242342";
        timestamp: "2021-03-23T10:00:40.065Z";
    };
    message: {
        intent: {
            item: {
                descriptor : {
                    name : "e-commerce dispute";
                };
            };
            fulfillment: {
                end : {
                    category : {
                        name : "mediation";
                    };
                    language:{
                        code : "en-us";
                    }
                };
            };
        };
    };
}