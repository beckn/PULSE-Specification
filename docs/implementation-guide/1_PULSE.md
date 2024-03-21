# Implementation Guide

This document contains the REQUIRED and RECOMMENDED standard functionality that must be implemented by any BPPs and BAPs in the ODR ecosystem.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BECKN-010](https://github.com/beckn/protocol-specifications/blob/draft/docs/BECKN-010-Keyword-Definitions-for-Technical-Specifications.md) from core specifications.

## 5.1 Discovery of ODR services

### 5.1.1 Recommendations for BPPs

The following recommendations need to be considered when implementing discovery functionality for an ODR Provider BPP

- REQUIRED. The BPP MUST implement the `search` endpoint to receive an `Intent` object sent by BAPs
- REQUIRED. The BPP MUST return a catalog of ODR services on the `on_search` callback endpoint specified in the `context.bpp_uri` field of the `search` request body.
- REQUIRED. The BPP MUST map its services to the `Item` schema.
- REQUIRED. Any ODR provider-related information like name, logo, short description must be mapped to the `Provider.descriptor` schema
- REQUIRED. If the BPP wants to group its ODR services under a specific category, it must map each category to the `Category` schema
- REQUIRED. Any service fulfillment related information MUST be mapped to the `Fulfillment` schema.
- REQUIRED. If the BPP does not want to respond to a search request, it MUST return a `ack.status` value equal to `NACK`
- RECOMMENDED. Upon receiving a `search` request, the BPP SHOULD return a catalog that best matches the intent. This can be done by indexing the catalog against the various probable paths in the `Intent` schema relevant to typical ODR service use cases

### 5.1.2 Recommendations for BAPs

- REQUIRED. The BAP MUST call the `search` endpoint of the BG to discover multiple BPPs on a network
- REQUIRED. The BAP MUST implement the `on_search` endpoint to consume the `Catalog` objects containing ODR services sent by BPPs.
- REQUIRED. The BAP MUST expect multiple catalogs sent by the respective ODR Providers on the network
- REQUIRED. The ODR services can be found in the `Catalog.providers[].items[]` array in the `on_search` request
- REQUIRED. If the `catalog.providers[].items[].xinput` object is present, then the BAP MUST redirect the user to, or natively render the form present on the link specified on the `items[].xinput.form.url` field.
- REQUIRED. If the `catalog.providers[].items[].xinput.required` field is set to `"true"` , then the BAP MUST NOT fire a `select`, `init` or `confirm` call until the form is submitted and a successful response is received
- RECOMMENDED. If the `catalog.providers[].items[].xinput.required` field is set to `"false"` , then the BAP SHOULD allow the user to skip filling the form

### Example

The search is broadcast to all providers on the network, there will be many providers. The providers could be all the Online Dispute Resolution service providers. The various search request can look something like this.

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "search",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "intent": {
      "category": {
        "descriptor": {
          "code": "arbitration-service"
        }
      }
    }
  }
}
```

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "search",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "intent": {
      "category": {
        "descriptor": {
          "code": "arbitration-service"
        }
      },
      "item": {
        "descriptor": {
          "name": "financial disputes"
        }
      }
    }
  }
}
```

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "search",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "intent": {
      "category": {
        "descriptor": {
          "code": "arbitration-service"
        }
      },
      "provider": {
        "id": "ODR001"
      },
      "item": {
        "descriptor": {
          "name": "financial disputes"
        }
      }
    }
  }
}
```

The on_search comes from all the providers, The providers have to be mapped to the provider schema. The `on_search` would look like this.

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "on_search",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "Online Dispute Resolution Services"
      }
    },
    "provider": [
      {
        "id": "ODR001",
        "descriptor": {
          "images": [
            {
              "url": "https://www.alpha.com/content/dam/alpha/india/assets/images/header/logo.png",
              "size_type": "xs"
            }
          ],
          "name": "Alpha",
          "short_desc": "Alpha Pvt Ltd., India.",
          "long_desc": "Alpha Pvt Ltd., India. provides online dispute resolution services. Out platform facilitates easy access to high quality service providers which helps avoid hassles of court, saving time and money and relationships.",
          "additional_desc": {
            "url": "https://www.alpha.com/content/aboutus"
          }
        },
        "categories": [
          {
            "id": "ODRCAT001",
            "descriptor": {
              "code": "civil-dispute",
              "name": "Civil Dispute"
            }
          },
          {
            "id": "ODRCAT002",
            "descriptor": {
              "code": "financial-dispute",
              "name": "Financial Dispute"
            }
          },
          {
            "id": "ODRCAT003",
            "descriptor": {
              "code": "employment-dispute",
              "name": "Employment Dispute"
            }
          },
          {
            "id": "ODRCAT004",
            "descriptor": {
              "code": "commercial-dispute",
              "name": "Commercial Dispute"
            }
          },
          {
            "id": "ODRCAT005",
            "descriptor": {
              "code": "family-dispute",
              "name": "Family Dispute"
            }
          }
        ],
        "items": [
          {
            "id": "ALPHA-ARB-01",
            "descriptor": {
              "code": "arbitration-service",
              "name": "Arbitration Services"
            },
            "category_ids": [
              "ODRCAT001",
              "ODRCAT002",
              "ODRCAT003",
              "ODRCAT004",
              "ODRCAT005"
            ],
            "add_ons": [
              {
                "id": "ALPHA-ARB-01-COU",
                "descriptor": {
                  "code": "counselling-service",
                  "name": "Counselling Services"
                }
              },
              {
                "id": "ALPHA-ARB-01-TRA",
                "descriptor": {
                  "code": "transcription-service",
                  "name": "Transcription Services"
                }
              }
            ]
          },
          {
            "id": "ALPHA-CONC-01",
            "descriptor": {
              "code": "conciliation-service",
              "name": "Conciliation Services"
            },
            "category_ids": [
              "ODRCAT001",
              "ODRCAT002",
              "ODRCAT003",
              "ODRCAT004",
              "ODRCAT005"
            ],
            "add_ons": [
              {
                "id": "ALPHA-CONC-01-COU",
                "descriptor": {
                  "code": "counselling-service",
                  "name": "Counselling Services"
                }
              },
              {
                "id": "ALPHA-CONC-01-TRA",
                "descriptor": {
                  "code": "transcription-service",
                  "name": "Transcription Services"
                }
              }
            ]
          },
          {
            "id": "ALPHA-MED-01",
            "descriptor": {
              "code": "mediation-service",
              "name": "Mediation Services"
            },
            "category_ids": ["ODRCAT002", "ODRCAT004", "ODRCAT005"],
            "add_ons": [
              {
                "id": "ALPHA-MED-01-COU",
                "descriptor": {
                  "code": "counselling-service",
                  "name": "Counselling Services"
                }
              },
              {
                "id": "ALPHA-MED-01-TRA",
                "descriptor": {
                  "code": "transcription-service",
                  "name": "Transcription Services"
                }
              }
            ]
          }
        ],
        "offers": [
          {
            "descriptor": {
              "name": "Offers on services"
            },
            "category_ids": ["ODRCAT004", "ODRCAT005"],
            "item_ids": ["ALPHA-MED-01", "ALPHA-ARB-01"]
          }
        ],
        "tags": [
          {
            "descriptor": {
              "code": "provider-info",
              "name": "Provider Information"
            },
            "list": [
              {
                "descriptor": {
                  "code": "area-of-expertise",
                  "name": "Area of expertise"
                },
                "value": "Financial Disputes, Commercial Disputes"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## Ordering

This section provides recommendations for implementing the APIs related to creating an order for a dispute.

### 5.2.1 Recommendations for BPPs

#### 5.2.1.1 Selecting a service from the catalog

- REQUIRED. The BPP MUST implement the `select` endpoint on the url specified in URL specified in the `context.bpp_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry
- REQUIRED. The BPP MUST check for a form submission at the URL specified on the `xinput.form.url` before acknowledging a `select` request.
- REQUIRED. If the ODR service provider has successfully received the information submitted by the ODR service consumer, the BPP must return an acknowledgement with `ack.status` set to `ACK` in response to the `select` request
- REQUIRED. If the ODR service provider has returned a successful acknowledgement to a `select` request, it MUST send the offer encapsulated in an `Order` object

#### 5.2.1.2 Initializing an order for an ODR related service

- REQUIRED. The BPP MUST implement the `init` endpoint on the url specified in URL specified in the `context.bpp_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry

#### 5.2.1.3 Confirming an order for an ODR related service

- REQUIRED. The BPP MUST implement the `confirm` endpoint on the url specified in URL specified in the `context.bpp_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry

### 5.2.2 Recommendations for BAPs

#### 5.2.2.1 Selecting a ODR service from the catalog

- REQUIRED. The BAP MUST implement the `on_select` endpoint on the url specified in URL specified in the `context.bap_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry
- REQUIRED. The BAP MUST check for a form submission at the URL specified on the `xinput.form.url` before acknowledging a `select` request.
- REQUIRED. If the ODR service provider has successfully received the information submitted by the ODR service consumer, the BAP must return an acknowledgement with `ack.status` set to `ACK` in response to the `on_select` request
- REQUIRED. If the ODR service provider has returned a successful acknowledgement to a `select` request, it MUST send the offer encapsulated in an `Order` object

#### 5.2.2.2 Initializing an order for a ODR service

- REQUIRED. The BAP MUST implement the `on_init` endpoint on the url specified in URL specified in the `context.bap_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry

#### 5.2.2.3 Confirming the order for the ODR service

- REQUIRED. The BAP MUST implement the `on_confirm` endpoint on the url specified in URL specified in the `context.bap_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry

### 5.2.3 Example Requests

An example of `select` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "select",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "order": {
      "provider": {
        "id": "ODR001"
      },
      "items": [
        {
          "id": "ALPHA-ARB-01"
        }
      ]
    }
  }
}
```

An example of `on_select` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "on_select",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "order": {
      "provider": {
        "id": "ODR001",
        "descriptor": {
          "images": [
            {
              "url": "https://www.alpha.com/content/dam/alpha/india/assets/images/header/logo.png",
              "size_type": "xs"
            }
          ],
          "name": "Alpha",
          "short_desc": "Alpha Pvt Ltd., India.",
          "long_desc": "Alpha Pvt Ltd., India. provides online dispute resolution services. Out platform facilitates easy access to high quality service providers which helps avoid hassles of court, saving time and money and relationships.",
          "additional_desc": {
            "url": "https://www.alpha.com/content/aboutus"
          }
        }
      },
      "items": [
        {
          "id": "ALPHA-ARB-01",
          "descriptor": {
            "code": "arbitration-service",
            "name": "Arbitration Services"
          }
        }
      ],
      "quote": {
        "price": {
          "currency": "INR",
          "value": "2500"
        },
        "breakup": [
          {
            "title": "Base fee",
            "price": {
              "value": "2000",
              "currency": "INR"
            }
          },
          {
            "title": "Fee per hearing",
            "price": {
              "value": "500",
              "currency": "INR"
            }
          }
        ]
      }
    }
  }
}
```

An example of `init` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "init",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "order": {
      "provider": {
        "id": "ODR001"
      },
      "items": [
        {
          "id": "ALPHA-ARB-01"
        }
      ],
      "billing": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "address": "21A, ABC Appartments, HSR Layout, Bengaluru",
        "city": "Bengaluru"
      },
      "fulfillments": [
        {
          "customer": {
            "person": {
              "name": "John Doe"
            },
            "contact": {
              "phone": "+91-9999999999",
              "email": "john.doe@example.com"
            }
          }
        }
      ]
    }
  }
}
```

An example of `on_init` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "on_init",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "order": {
      "id": "fcbc405b6608",
      "provider": {
        "id": "ODR001",
        "descriptor": {
          "images": [
            {
              "url": "https://www.alpha.com/content/dam/alpha/india/assets/images/header/logo.png",
              "size_type": "xs"
            }
          ],
          "name": "Alpha",
          "short_desc": "Alpha Pvt Ltd., India.",
          "long_desc": "Alpha Pvt Ltd., India. provides online dispute resolution services. Out platform facilitates easy access to high quality service providers which helps avoid hassles of court, saving time and money and relationships.",
          "additional_desc": {
            "url": "https://www.alpha.com/content/aboutus"
          }
        }
      },
      "items": [
        {
          "id": "ALPHA-ARB-01",
          "descriptor": {
            "code": "arbitration-service",
            "name": "Arbitration Services"
          },
          "xinput": {
            "head": {
              "descriptor": {
                "name": "Dispute Details"
              },
              "index": {
                "min": 0,
                "cur": 2,
                "max": 2
              },
              "headings": [
                "Respondent Details",
                "Consent Form",
                "Dispute Details"
              ]
            },
            "form": {
              "mime_type": "text/html",
              "url": "https://6vs8xnx5i7.alpha.co.in/agreement/xinput/formid/a23f2fdfbbb8ac402bfd54f"
            },
            "required": true
          }
        }
      ],
      "quote": {
        "price": {
          "currency": "INR",
          "value": "12500"
        },
        "breakup": [
          {
            "title": "Base fee",
            "price": {
              "value": "7000",
              "currency": "INR"
            }
          },
          {
            "title": "Agent fees",
            "price": {
              "value": "5000",
              "currency": "INR"
            }
          },
          {
            "title": "Fee per hearing",
            "price": {
              "value": "500",
              "currency": "INR"
            }
          }
        ]
      },
      "billing": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "address": "21A, ABC Appartments, HSR Layout, Bengaluru",
        "city": "Bengaluru"
      },
      "fulfillments": [
        {
          "customer": {
            "person": {
              "name": "John Doe"
            },
            "contact": {
              "phone": "+91-9999999999",
              "email": "john.doe@example.com"
            }
          },
          "agent": {
            "person": {
              "id": "fsjks743DGS",
              "name": "Mr Adam Smith"
            }
          },
          "state": {
            "descriptor": {
              "code": "arbitration-initiated",
              "name": "Arbitration for dispute order initialized"
            }
          }
        }
      ],
      "payments": [
        {
          "type": "ON-ORDER",
          "url": "https://payment.alphaodr.in",
          "params": {
            "amount": "12000",
            "currency": "INR"
          },
          "status": "NOT-PAID",
          "time": {
            "range": {
              "start": "01-06-2023 00:00:00",
              "end": "30-06-2023 23:59:59"
            }
          }
        }
      ],
      "cancellation_terms": [
        {
          "fulfillment_state": {
            "descriptor": {
              "code": "dispute-hearing-in-progress"
            }
          },
          "cancellation_fee": {
            "percentage": "30%"
          },
          "external_ref": {
            "mimetype": "text/html",
            "url": "https://alpha.in/charge/tnc.html"
          }
        }
      ]
    }
  }
}
```

An example of `confirm` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "confirm",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "order": {
      "provider": {
        "id": "ODR001"
      },
      "items": [
        {
          "id": "ALPHA-ARB-01",
          "xinput": {
            "form_response": {
              "status": true,
              "submission_id": "c844d5f4-29c3-4398-b594-8b4716ef5dbf"
            }
          }
        }
      ],
      "billing": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "address": "21A, ABC Appartments, HSR Layout, Bengaluru",
        "city": "Bengaluru"
      },
      "fulfillments": [
        {
          "customer": {
            "person": {
              "name": "John Doe"
            },
            "contact": {
              "phone": "+91-9999999999",
              "email": "john.doe@example.com"
            }
          }
        }
      ],
      "payments": [
        {
          "params": {
            "amount": "12000",
            "currency": "INR"
          },
          "status": "PAID"
        }
      ]
    }
  }
}
```

An example of `on_confirm` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "on_confirm",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "order": {
      "id": "fcbc405b6608",
      "provider": {
        "id": "ODR001",
        "descriptor": {
          "images": [
            {
              "url": "https://www.alpha.com/content/dam/alpha/india/assets/images/header/logo.png",
              "size_type": "xs"
            }
          ],
          "name": "Alpha",
          "short_desc": "Alpha Pvt Ltd., India.",
          "long_desc": "Alpha Pvt Ltd., India. provides online dispute resolution services. Out platform facilitates easy access to high quality service providers which helps avoid hassles of court, saving time and money and relationships.",
          "additional_desc": {
            "url": "https://www.alpha.com/content/aboutus"
          }
        }
      },
      "items": [
        {
          "id": "ALPHA-ARB-01",
          "descriptor": {
            "code": "arbitration-service",
            "name": "Arbitration Services"
          }
        }
      ],
      "quote": {
        "price": {
          "currency": "INR",
          "value": "12500"
        },
        "breakup": [
          {
            "title": "Base fee",
            "price": {
              "value": "7000",
              "currency": "INR"
            }
          },
          {
            "title": "Agent fees",
            "price": {
              "value": "5000",
              "currency": "INR"
            }
          },
          {
            "title": "Fee per hearing",
            "price": {
              "value": "500",
              "currency": "INR"
            }
          }
        ]
      },
      "billing": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "address": "21A, ABC Appartments, HSR Layout, Bengaluru",
        "city": "Bengaluru"
      },
      "fulfillments": [
        {
          "customer": {
            "person": {
              "name": "John Doe"
            },
            "contact": {
              "phone": "+91-9999999999",
              "email": "john.doe@example.com"
            }
          },
          "agent": {
            "person": {
              "id": "fsjks743DGS",
              "name": "Mr Adam Smith"
            }
          },
          "state": {
            "descriptor": {
              "code": "arbitration-confirmed",
              "name": "Dispute Order Confirmed"
            }
          },
          "stops": [
            {
              "instructions": {
                "name": "Instructions after order confirm",
                "short_desc": "Navigate to the following provider link to continue the order",
                "media": [
                  {
                    "url": "https://alpha-odr-network-bpp.becknprotocol.io/dispute"
                  }
                ]
              }
            }
          ]
        }
      ],
      "payments": [
        {
          "type": "ON-ORDER",
          "params": {
            "amount": "12000",
            "currency": "INR"
          },
          "status": "PAID",
          "time": {
            "range": {
              "start": "01-06-2023 00:00:00",
              "end": "30-06-2023 23:59:59"
            }
          }
        }
      ],
      "cancellation_terms": [
        {
          "fulfillment_state": {
            "descriptor": {
              "code": "dispute-hearing-in-progress"
            }
          },
          "cancellation_fee": {
            "percentage": "30%"
          },
          "external_ref": {
            "mimetype": "text/html",
            "url": "https://alpha.in/charge/tnc.html"
          }
        }
      ],
      "docs": [
        {
          "descriptor": {
            "code": "case-document",
            "name": "Case Documentation",
            "short_desc": "Download all the case documents from here"
          },
          "mime_type": "application/pdf",
          "url": "https://xyz.com/case-doc/04389d8c-6a50-4664-9c08-4ee45fef44e8.pdf"
        }
      ]
    }
  }
}
```

## Fulfillment

This section contains recommendations for implementing the APIs related to fulfilling a ODR service order

### 5.3.1 Recommendations for BPPs

#### 5.3.1.1 Sending status updates

- REQUIRED. The BPP MUST implement the `status` endpoint on the url specified in URL specified in the `context.bpp_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry

#### 5.3.1.2 Updating an order for ODR service

- REQUIRED. The BPP MUST implement the `update` endpoint on the url specified in URL specified in the `context.bpp_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry

#### 5.3.1.3 Cancelling a ODR service order

- REQUIRED. The BPP MUST implement the `cancel` endpoint on the url specified in URL specified in the `context.bpp_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry
- REQUIRED. The BPP MUST implement the `get_cancellation_reasons` endpoint on the url specified in URL specified in the `context.bpp_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry

### 5.3.2 Recommendations for BAPs

#### 5.3.2.1 Sending status updates

- REQUIRED. The BAP MUST implement the `on_status` endpoint on the url specified in URL specified in the `context.bap_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry

#### 5.3.2.2 Updating an order for ODR service

- REQUIRED. The BAP MUST implement the `on_update` endpoint on the url specified in URL specified in the `context.bap_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry

#### 5.3.2.3 Cancelling a ODR service application

- REQUIRED. The BAP MUST implement the `on_cancel` endpoint on the url specified in URL specified in the `context.bap_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry
- REQUIRED. The BAP MUST implement the `cancellation_reasons` endpoint on the url specified in URL specified in the `context.bap_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry.

### 5.3.4 Example Requests

An example of `status` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "status",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "ttl": "PT10M",
    "bpp_id": "odr-bpp.becknprotocol.io",
    "bpp_uri": "https://odr-network-bpp.becknprotocol.io"
  },
  "message": {
    "order_id": "66b7b9bad166"
  }
}
```

An example of `on_status` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "on_status",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "order": {
      "id": "fcbc405b6608",
      "provider": {
        "id": "ODR001",
        "descriptor": {
          "images": [
            {
              "url": "https://www.alpha.com/content/dam/alpha/india/assets/images/header/logo.png",
              "size_type": "xs"
            }
          ],
          "name": "Alpha",
          "short_desc": "Alpha Pvt Ltd., India.",
          "long_desc": "Alpha Pvt Ltd., India. provides online dispute resolution services. Out platform facilitates easy access to high quality service providers which helps avoid hassles of court, saving time and money and relationships.",
          "additional_desc": {
            "url": "https://www.alpha.com/content/aboutus"
          }
        }
      },
      "items": [
        {
          "id": "ALPHA-ARB-01",
          "descriptor": {
            "code": "arbitration-service",
            "name": "Arbitration Services"
          }
        }
      ],
      "quote": {
        "price": {
          "currency": "INR",
          "value": "12500"
        },
        "breakup": [
          {
            "title": "Base fee",
            "price": {
              "value": "7000",
              "currency": "INR"
            }
          },
          {
            "title": "Agent fees",
            "price": {
              "value": "5000",
              "currency": "INR"
            }
          },
          {
            "title": "Fee per hearing",
            "price": {
              "value": "500",
              "currency": "INR"
            }
          }
        ]
      },
      "billing": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "address": "21A, ABC Appartments, HSR Layout, Bengaluru",
        "city": "Bengaluru"
      },
      "fulfillments": [
        {
          "customer": {
            "person": {
              "name": "John Doe"
            },
            "contact": {
              "phone": "+91-9999999999",
              "email": "john.doe@example.com"
            }
          },
          "agent": {
            "person": {
              "id": "fsjks743DGS",
              "name": "Mr Adam Smith"
            }
          },
          "state": {
            "descriptor": {
              "code": "arbitration-in-progress",
              "name": "Arbitration In Progress"
            }
          },
          "stops": [
            {
              "instructions": {
                "name": "Instructions after order confirm",
                "short_desc": "Navigate to the following provider link to continue the order",
                "media": [
                  {
                    "url": "https://alpha-odr-network-bpp.becknprotocol.io/dispute"
                  }
                ]
              }
            }
          ]
        }
      ],
      "payments": [
        {
          "type": "ON-ORDER",
          "params": {
            "amount": "12000",
            "currency": "INR"
          },
          "status": "PAID",
          "time": {
            "range": {
              "start": "01-06-2023 00:00:00",
              "end": "30-06-2023 23:59:59"
            }
          }
        }
      ],
      "cancellation_terms": [
        {
          "fulfillment_state": {
            "descriptor": {
              "code": "complaint-resolved"
            }
          },
          "cancellation_fee": {
            "percentage": "30%"
          },
          "external_ref": {
            "mimetype": "text/html",
            "url": "https://alpha.in/charge/tnc.html"
          }
        }
      ],
      "docs": [
        {
          "descriptor": {
            "code": "case-document",
            "name": "Case Documentation",
            "short_desc": "Download all the case documents from here"
          },
          "mime_type": "application/pdf",
          "url": "https://xyz.com/case-doc/04389d8c-6a50-4664-9c08-4ee45fef44e8.pdf"
        }
      ]
    }
  }
}
```

An example of `cancel` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "cancel",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "order_id": "572BHD23HD",
    "cancellation_reason_id": "5",
    "descriptor": {
      "short_desc": "Dispute dropped"
    }
  }
}
```

An example of `on_cancel` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "on_cancel",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "order": {
      "id": "fcbc405b6608",
      "status": "CANCELLED",
      "provider": {
        "id": "ODR001",
        "descriptor": {
          "images": [
            {
              "url": "https://www.alpha.com/content/dam/alpha/india/assets/images/header/logo.png",
              "size_type": "xs"
            }
          ],
          "name": "Alpha",
          "short_desc": "Alpha Pvt Ltd., India.",
          "long_desc": "Alpha Pvt Ltd., India. provides online dispute resolution services. Out platform facilitates easy access to high quality service providers which helps avoid hassles of court, saving time and money and relationships.",
          "additional_desc": {
            "url": "https://www.alpha.com/content/aboutus"
          }
        }
      },
      "items": [
        {
          "id": "ALPHA-ARB-01",
          "descriptor": {
            "code": "arbitration-service",
            "name": "Arbitration Services"
          }
        }
      ],
      "quote": {
        "price": {
          "currency": "INR",
          "value": "12500"
        },
        "breakup": [
          {
            "title": "Base fee",
            "price": {
              "value": "7000",
              "currency": "INR"
            }
          },
          {
            "title": "Agent fees",
            "price": {
              "value": "5000",
              "currency": "INR"
            }
          },
          {
            "title": "Fee per hearing",
            "price": {
              "value": "500",
              "currency": "INR"
            }
          },
          {
            "title": "Cancellation fees",
            "price": {
              "value": "5000",
              "currency": "INR"
            }
          }
        ]
      },
      "billing": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "address": "21A, ABC Appartments, HSR Layout, Bengaluru",
        "city": "Bengaluru"
      },
      "fulfillments": [
        {
          "customer": {
            "person": {
              "name": "John Doe"
            },
            "contact": {
              "phone": "+91-9999999999",
              "email": "john.doe@example.com"
            }
          },
          "agent": {
            "person": {
              "id": "fsjks743DGS",
              "name": "Mr Adam Smith"
            }
          },
          "state": {
            "descriptor": {
              "code": "dispute-cancelled",
              "name": "Dispute Order Cancelled"
            }
          }
        }
      ],
      "payments": [
        {
          "type": "ON-ORDER",
          "params": {
            "amount": "12000",
            "currency": "INR"
          },
          "status": "PAID",
          "time": {
            "range": {
              "start": "01-06-2023 00:00:00",
              "end": "30-06-2023 23:59:59"
            }
          }
        }
      ],
      "cancellation_terms": [
        {
          "fulfillment_state": {
            "descriptor": {
              "code": "dispute-hearing-in-progress"
            }
          },
          "cancellation_fee": {
            "percentage": "30%"
          },
          "external_ref": {
            "mimetype": "text/html",
            "url": "https://alpha.in/charge/tnc.html"
          }
        }
      ],
      "docs": [
        {
          "descriptor": {
            "code": "case-document",
            "name": "Case Documentation",
            "short_desc": "Download all the case documents from here"
          },
          "mime_type": "application/pdf",
          "url": "https://xyz.com/case-doc/04389d8c-6a50-4664-9c08-4ee45fef44e8.pdf"
        }
      ]
    }
  }
}
```

An example of `update` request to update an agent

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "version": "1.1.0",
    "action": "update",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "odr-bpp.becknprotocol.io",
    "bpp_uri": "https://odr-network-bpp.becknprotocol.io",
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "166a5633-66d2-4ec8-bdcb-65cfeb1e4697",
    "ttl": "PT10M",
    "timestamp": "2023-05-25T05:23:03.443Z"
  },
  "message": {
    "update_target": "order.fulfillments[0].agent",
    "order": {
      "id": "66b7b9bad166",
      "fulfillments": [
        {
          "agent": {
            "person": {
              "id": "ca063dc9d321",
              "name": "Mr Adam Smith"
            }
          }
        }
      ]
    }
  }
}
```

An example of `on_update` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "on_update",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "order": {
      "id": "fcbc405b6608",
      "provider": {
        "id": "ODR001",
        "descriptor": {
          "images": [
            {
              "url": "https://www.alpha.com/content/dam/alpha/india/assets/images/header/logo.png",
              "size_type": "xs"
            }
          ],
          "name": "Alpha",
          "short_desc": "Alpha Pvt Ltd., India.",
          "long_desc": "Alpha Pvt Ltd., India. provides online dispute resolution services. Out platform facilitates easy access to high quality service providers which helps avoid hassles of court, saving time and money and relationships.",
          "additional_desc": {
            "url": "https://www.alpha.com/content/aboutus"
          }
        }
      },
      "items": [
        {
          "id": "ALPHA-ARB-01",
          "descriptor": {
            "code": "arbitration-service",
            "name": "Arbitration Services"
          }
        }
      ],
      "quote": {
        "price": {
          "currency": "INR",
          "value": "12500"
        },
        "breakup": [
          {
            "title": "Base fee",
            "price": {
              "value": "7000",
              "currency": "INR"
            }
          },
          {
            "title": "Agent fees",
            "price": {
              "value": "5000",
              "currency": "INR"
            }
          },
          {
            "title": "Fee per hearing",
            "price": {
              "value": "500",
              "currency": "INR"
            }
          }
        ]
      },
      "billing": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "address": "21A, ABC Appartments, HSR Layout, Bengaluru",
        "city": "Bengaluru"
      },
      "fulfillments": [
        {
          "customer": {
            "person": {
              "name": "John Doe"
            },
            "contact": {
              "phone": "+91-9999999999",
              "email": "john.doe@example.com"
            }
          },
          "agent": {
            "person": {
              "id": "ca063dc9d321",
              "name": "Mr Adam Smith"
            }
          },
          "state": {
            "descriptor": {
              "code": "agent-updated",
              "name": "Case agent updated"
            }
          },
          "stops": [
            {
              "instructions": {
                "name": "Instructions after order confirm",
                "short_desc": "Navigate to the following provider link to continue the order",
                "media": [
                  {
                    "url": "https://alpha-odr-network-bpp.becknprotocol.io/dispute"
                  }
                ]
              }
            },
            {
              "time": {
                "label": "Hearing Date",
                "Range": {
                  "start": "2023-06-27T00:00:00.00Z",
                  "end": "2023-08-02T00:00:00.00Z"
                }
              }
            }
          ]
        }
      ],
      "payments": [
        {
          "type": "ON-ORDER",
          "params": {
            "amount": "12000",
            "currency": "INR"
          },
          "status": "PAID",
          "time": {
            "range": {
              "start": "01-06-2023 00:00:00",
              "end": "30-06-2023 23:59:59"
            }
          }
        }
      ],
      "cancellation_terms": [
        {
          "fulfillment_state": {
            "descriptor": {
              "code": "dispute-hearing-in-progress"
            }
          },
          "cancellation_fee": {
            "percentage": "30%"
          },
          "external_ref": {
            "mimetype": "text/html",
            "url": "https://alpha.in/charge/tnc.html"
          }
        }
      ],
      "docs": [
        {
          "descriptor": {
            "code": "case-document",
            "name": "Case Documentation",
            "short_desc": "Download all the case documents from here"
          },
          "mime_type": "application/pdf",
          "url": "https://xyz.com/case-doc/04389d8c-6a50-4664-9c08-4ee45fef44e8.pdf"
        }
      ]
    }
  }
}
```

## Post-fulfillment

This section contains recommendations for implementing the APIs after fulfilling a ODR service

### 5.4.1 Recommendations for BPPs

#### 5.4.1.1 Rating and Feedback

- REQUIRED. The BPP MUST implement the `rating` endpoint on the url specified in URL specified in the `context.bpp_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry
- REQUIRED. The BPP MUST implement the `get_rating_categories` endpoint on the url specified in URL specified in the `context.bpp_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry

#### 5.4.1.2 Providing Support

- REQUIRED. The BPP MUST implement the `support` endpoint on the url specified in URL specified in the `context.bpp_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry

### 5.4.2 Recommendations for BAPs

#### 5.4.2.1 Rating and Feedback

- REQUIRED. The BAP MUST implement the `on_rating` endpoint on the url specified in URL specified in the `context.bap_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry
- REQUIRED. The BAP MUST implement the `rating_categories` endpoint on the url specified in URL specified in the `context.bap_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry

#### 5.4.2.2 Providing Support

- REQUIRED. The BAP MUST implement the `on_support` endpoint on the url specified in URL specified in the `context.bap_uri` field sent during `on_search`. In case of permissioned networks, this URL MUST match the `Subscriber.url` present on the respective entry in the Network Registry

### 5.4.4 Example Requests

An example of `rating` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "rating",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "ratings": [
      {
        "id": "a9aaecca-10b7-4d19-b640-b047a7c621961676906777032",
        "rating_category": "portal"
      }
    ]
  }
}
```

An example of `on_rating` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "on_rating",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "feedback_form": {
      "xinput": {
        "form": {
          "url": "https://alpha-odr-network-bpp.becknprotocol.io/feedback/portal"
        },
        "required": "false"
      }
    }
  }
}
```

An example of `support` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "support",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "support": {
      "order_id": "572BHD23HD",
      "phone": "+919876543210",
      "email": "john.doe@gmail.com"
    }
  }
}
```

An example of `on_support` request

```json
{
  "context": {
    "domain": "online-dispute-resolution:0.1.0",
    "location": {
      "country": {
        "code": "IND"
      }
    },
    "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
    "message_id": "$bb579fb8-cb82-4824-be12-fcbc405b6608",
    "action": "on_support",
    "timestamp": "2023-05-25T05:23:03.443Z",
    "version": "1.1.0",
    "bap_uri": "https://odr-network-bap.becknprotocol.io/",
    "bap_id": "odr-bap.becknprotocol.io",
    "bpp_id": "alpha-odr-bpp.becknprotocol.io",
    "bpp_uri": "https://alpha-odr-network-bpp.becknprotocol.io",
    "ttl": "PT10M"
  },
  "message": {
    "support": {
      "order_id": "572BHD23HD",
      "phone": "1800 1080",
      "email": "info@alpha.live",
      "url": "https://www.alpha.com/helpdesk"
    }
  }
}
```
