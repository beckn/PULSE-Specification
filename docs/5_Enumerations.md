
# Domain Enumerations

This documentation outlines the enumerations and their corresponding values utilized within the DRoP API Specification. Enumerations such as FulfillmentType, OrderStatus, PaymentStatus, TrackingStatus are defined alongside their respective states, providing clarity on the status of delivery, orders, payment, tracking and much more within the system. Developers can refer to this document to ensure consistent interpretation and usage of these enumerations throughout their integration within the DRoP usecase.

Note: The below list is NOT a recommended or required standard. This list will be standardized on the basis of adoption by implementers. 

## Examples:
| Attribute Name | Description | Enumerations                                                                                            |
|-----------------------------------------|---------------------------------------|--------------------------------------------------------------------------------------------------------|
| Ack.status   | The status of the acknowledgement. If the request passes the validation criteria of the BPP, then this is set to ACK. If the request fails the validation criteria, then this is set to NACK.| ACK,NACK |
| Cancellation.cancelled_by                             | Represent the user who has cancelled the order| COMPLAINANT,ODR-PROVIDER|
| Descriptor.additional_desc.content_type| Different mime-type of the content in additional description | text/plain,text/html,application/json|
| Error.type                       | Type of errors a NP can send                | CONTEXT-ERROR,CORE-ERROR,DOMAIN-ERROR,POLICY-ERROR,JSON_SCHEMA-ERROR|
| Form.mime_type | This field indicates the nature and format of the form received by querying the url. MIME types are defined and standardized in IETF's RFC 6838.| text/html, application/xml|
| Image.size_type|The size of the image. The network policy can define the default dimensions of each type| xs,sm,md,lg,xl,custom|
| Payment.collected_by|This field indicates who is the collector of payment. The BAP can set this value to 'bap' if it wants to collect the payment first and settle it to the BPP. If the BPP agrees to those terms, the BPP should not send the payment url. Alternatively, the BPP can set this field with the value 'bpp' if it wants the payment to be made directly.|BAP,BPP|
| Payment.status| Status of the Payment transaction| PAID,NOT-PAID,PARTIALLY-PAID|
| Payment.type| This field indicates the type of the payment. BPP can set this value depending on the phase when they need the order payment to be paid by the buyer| On-Order,Pre-Fulfillment,Fulfillment-Processing,On-Fulfillment,Post-Fulfillment|
| Rating.rating_category| Category of the entity being rated| Item,Order,Provider,Fulfillment,Agent,Support|
| Scalar.type| NA |CONSTANT,VARIABLE|
| Support.type| This field indicates the type of entity on which support is needed| order,billing,fulfillment|

## Contributing to the Enums:
To Contribute to Enums, contributor are requested to submit a PR with updated Enums.md file to the `draft` branch.