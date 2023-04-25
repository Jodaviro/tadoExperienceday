/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search'],
    
    (record, search) => {
        const eventCodes = {
            AUTHORISATION: 1,
            NOTIFICATION_OF_FRAUD: 2,
            NOTIFICATION_OF_CHARGEBACK: 3,
            CHARGEBACK: 4,
            CHARGEBACK_REVERSED : 5
        }

        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {

        }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {
            const notificationItems = requestBody.notificationItems
            const notificationRecs = []
            let invalidEvent

            notificationItems.forEach((value) => {
                let eventCode = value.NotificationRequestItem.eventCode

                if(!eventCodes.hasOwnProperty(eventCode)){
                    const message = `${eventCode} is not a valid event code`
                    log.error('eventCodeMessage', message)

                    invalidEvent = {
                        code: 400,
                        message: message
                    }
                }
                
                let notificationRec ={ 
                    merchantAccountCode : value.NotificationRequestItem.merchantAccountCode,
                    eventCodeId : eventCodes[eventCode],
                    date : value.NotificationRequestItem.eventDate,
                    pspReference : value.NotificationRequestItem.pspReference,
                    amount : value.NotificationRequestItem.amount.value,
                    currency : value.NotificationRequestItem.amount.currency,
                    eventDate : value.NotificationRequestItem.eventDate,
                    notificationPayload: value
                }

                notificationRecs.push(notificationRec)

            })

            if(invalidEvent){
                return {
                    code: invalidEvent.code,
                    message: invalidEvent.message
                }
            }

            createNotificationRecs(notificationRecs)

            return {
                code: 200,
                message: "Acepted"
            }
        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {

        }

        const createNotificationRecs = (notificationRecs) => {
            log.debug('notificationRecs', notificationRecs)
            notificationRecs.forEach((rec) => {
                
                const notificationRec = record.create({
                    type: 'customrecord_tado_payment_notification'
                })
                
                notificationRec.setValue('custrecord_pn_eventcode', rec.eventCodeId)
                notificationRec.setValue('custrecord_pn_amount', rec.amount)
                notificationRec.setValue('custrecord_pn_req_item', rec.notificationPayload)
                notificationRec.setValue('custrecord_pn_pspref', rec.pspReference)
                notificationRec.setValue('custrecord_pn_date', new Date(rec.date))
                notificationRec.setValue('custrecord_pn_currency', getCurrencyId(rec.currency))

                notificationRec.save()

            })
        }

        const getCurrencyId = (isocode) => {
           
            var internalid;
            
            search.create({
                type: 'currency',
                filters: ['symbol', 'is', isocode],
                columns: ['internalid']
            }).run().each(function (res) {
                log.debug('res', res);
                internalid = res.getValue('internalid');
            });
            
            return internalid;
            
        }

        return {get, put, post, delete: doDelete}

    });
