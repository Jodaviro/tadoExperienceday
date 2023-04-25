/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define([],
    
    () => {
        const eventCodes = {
            AUTHORISATION: "AUTHORISATION",
            NOTIFICATION_OF_FRAUD: "NOTIFICATION_OF_FRAUD",
            NOTIFICATION_OF_CHARGEBACK: "NOTIFICATION_OF_CHARGEBACK",
            CHARGEBACK: "CHARGEBACK",
            CHARGEBACK_REVERSED : "CHARGEBACK_REVERSED"
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
            })

            if(invalidEvent){
                return {
                    code: invalidEvent.code,
                    message: invalidEvent.message
                }
            }
            
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

        return {get, put, post, delete: doDelete}

    });
