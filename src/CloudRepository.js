/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/*
 * This module uses the singleton pattern to provide an object that implements the API
 * that is used to access an AWS cloud based document repository. It treats documents
 * as UTF-8 encoded strings.
 */
const bali = require('bali-component-framework');
const axios = require('axios');

/**
 * This function returns an object that implements the API for the AWS cloud document
 * repository.
 * 
 * @param {Object} notary An object that implements the API for the digital notary.
 * @param {Reference} cloudURL A reference that defines the URL for the cloud repository.
 * @param {Boolean} debug An optional flag that determines whether or not exceptions
 * will be logged to the error console.
 * @returns {Object} An object implementing the document repository interface.
 */
exports.repository = function(notary, cloudURL, debug) {
    debug = debug || false;
    const account = notary.getAccount();

    // return a singleton object for the API
    return {

        /**
         * This function returns a string providing attributes about this repository.
         * 
         * @returns {String} A string providing attributes about this repository.
         */
        toString: function() {
            const catalog = bali.catalog({
                $module: '$CloudRepository',
                $account: account,
                $url: cloudURL
            });
            return catalog.toString();
        },

        /**
         * This function returns a reference to this document repository.
         * 
         * @returns {Reference} A reference to this document repository.
         */
        getURL: function() {
            return cloudURL;
        },

        /**
         * This function checks to see whether or not a certificate is associated with the
         * specified identifier.
         * 
         * @param {String} certificateId The unique identifier (including version number) for
         * the certificate being checked.
         * @returns {Boolean} Whether or not the certificate exists.
         */
        certificateExists: async function(certificateId) {
            try {
                const credentials = await generateCredentials(notary);
                const status = await sendRequest(credentials, '$certificateExists', cloudURL, 'HEAD', 'certificate', certificateId);
                return status;
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$certificateExists',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $certificateId: certificateId ? bali.text(certificateId) : bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting check to see if the certificate exists.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        },

        /**
         * This function attempts to retrieve the specified certificate from the repository.
         * 
         * @param {String} certificateId The unique identifier (including version number) for
         * the certificate being fetched.
         * @returns {String} The canonical source string for the certificate, or
         * <code>undefined</code> if it doesn't exist.
         */
        fetchCertificate: async function(certificateId) {
            try {
                const credentials = await generateCredentials(notary);
                const certificate = await sendRequest(credentials, '$fetchCertificate', cloudURL, 'GET', 'certificate', certificateId);
                return certificate;
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$fetchCertificate',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $certificateId: certificateId ? bali.text(certificateId) : bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting to fetch the certificate.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        },

        /**
         * This function creates a new certificate in the repository.
         * 
         * @param {String} certificateId The unique identifier (including version number) for
         * the certificate being created.
         * @param {String} certificate The canonical source string for the certificate.
         */
        createCertificate: async function(certificateId, certificate) {
            try {
                const credentials = await generateCredentials(notary);
                await sendRequest(credentials, '$createCertificate', cloudURL, 'POST', 'certificate', certificateId, certificate);
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$createCertificate',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $certificateId: certificateId ? bali.text(certificateId) : bali.NONE,
                    $certificate: certificate || bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting to create the certificate.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        },

        /**
         * This function checks to see whether or not a draft document is associated with the
         * specified identifier.
         * 
         * @param {String} draftId The unique identifier (including version number) for
         * the draft document being checked.
         * @returns {Boolean} Whether or not the draft document exists.
         */
        draftExists: async function(draftId) {
            try {
                const credentials = await generateCredentials(notary);
                const status = await sendRequest(credentials, '$draftExists', cloudURL, 'HEAD', 'draft', draftId);
                return status;
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$draftExists',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $draftId: draftId ? bali.text(draftId) : bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting check to see if the draft exists.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        },

        /**
         * This function attempts to retrieve the specified draft document from the repository.
         * 
         * @param {String} draftId The unique identifier (including version number) for
         * the draft document being fetched.
         * @returns {String} The canonical source string for the draft document, or
         * <code>undefined</code> if it doesn't exist.
         */
        fetchDraft: async function(draftId) {
            try {
                const credentials = await generateCredentials(notary);
                const draft = await sendRequest(credentials, '$fetchDraft', cloudURL, 'GET', 'draft', draftId);
                return draft;
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$fetchDraft',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $draftId: draftId ? bali.text(draftId) : bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting to fetch the draft.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        },

        /**
         * This function saves a draft document in the repository.
         * 
         * @param {String} draftId The unique identifier (including version number) for
         * the draft document being created.
         * @param {String} draft The canonical source string for the draft document.
         */
        saveDraft: async function(draftId, draft) {
            try {
                const credentials = await generateCredentials(notary);
                await sendRequest(credentials, '$saveDraft', cloudURL, 'PUT', 'draft', draftId, draft);
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$saveDraft',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $draftId: draftId ? bali.text(draftId) : bali.NONE,
                    $draft: draft || bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting to create the draft.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        },

        /**
         * This function attempts to delete the specified draft document from the repository.
         * 
         * @param {String} draftId The unique identifier (including version number) for
         * the draft document being deleted.
         */
        deleteDraft: async function(draftId) {
            try {
                const credentials = await generateCredentials(notary);
                await sendRequest(credentials, '$deleteDraft', cloudURL, 'DELETE', 'draft', draftId);
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$deleteDraft',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $draftId: draftId ? bali.text(draftId) : bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting to delete the draft.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        },

        /**
         * This function checks to see whether or not a document is associated with the
         * specified identifier.
         * 
         * @param {String} documentId The unique identifier (including version number) for
         * the document being checked.
         * @returns {Boolean} Whether or not the document exists.
         */
        documentExists: async function(documentId) {
            try {
                const credentials = await generateCredentials(notary);
                const status = await sendRequest(credentials, '$documentExists', cloudURL, 'HEAD', 'document', documentId);
                return status;
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$documentExists',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $documentId: documentId ? bali.text(documentId) : bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting check to see if the document exists.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        },

        /**
         * This function attempts to retrieve the specified document from the repository.
         * 
         * @param {String} documentId The unique identifier (including version number) for
         * the document being fetched.
         * @returns {String} The canonical source string for the document, or
         * <code>undefined</code> if it doesn't exist.
         */
        fetchDocument: async function(documentId) {
            try {
                const credentials = await generateCredentials(notary);
                const document = await sendRequest(credentials, '$fetchDocument', cloudURL, 'GET', 'document', documentId);
                return document;
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$fetchDocument',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $documentId: documentId ? bali.text(documentId) : bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting to fetch the document.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        },

        /**
         * This function creates a new document in the repository.
         * 
         * @param {String} documentId The unique identifier (including version number) for
         * the document being created.
         * @param {String} document The canonical source string for the document.
         */
        createDocument: async function(documentId, document) {
            try {
                const credentials = await generateCredentials(notary);
                await sendRequest(credentials, '$createDocument', cloudURL, 'POST', 'document', documentId, document);
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$createDocument',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $documentId: documentId ? bali.text(documentId) : bali.NONE,
                    $document: document || bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting to create the document.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        },

        /**
         * This function checks to see whether or not a type is associated with the
         * specified identifier.
         * 
         * @param {String} typeId The unique identifier (including version number) for
         * the type being checked.
         * @returns {Boolean} Whether or not the type exists.
         */
        typeExists: async function(typeId) {
            try {
                const credentials = await generateCredentials(notary);
                const status = await sendRequest(credentials, '$typeExists', cloudURL, 'HEAD', 'type', typeId);
                return status;
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$typeExists',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $typeId: typeId ? bali.text(typeId) : bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting check to see if the type exists.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        },

        /**
         * This function attempts to retrieve the specified type from the repository.
         * 
         * @param {String} typeId The unique identifier (including version number) for
         * the type being fetched.
         * @returns {String} The canonical source string for the type, or
         * <code>undefined</code> if it doesn't exist.
         */
        fetchType: async function(typeId) {
            try {
                const credentials = await generateCredentials(notary);
                const type = await sendRequest(credentials, '$fetchType', cloudURL, 'GET', 'type', typeId);
                return type;
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$fetchType',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $typeId: typeId ? bali.text(typeId) : bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting to fetch the type.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        },

        /**
         * This function creates a new type in the repository.
         * 
         * @param {String} typeId The unique identifier (including version number) for
         * the type being created.
         * @param {String} type The canonical source string for the type.
         */
        createType: async function(typeId, type) {
            try {
                const credentials = await generateCredentials(notary);
                await sendRequest(credentials, '$createType', cloudURL, 'POST', 'type', typeId, type);
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$createType',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $typeId: typeId ? bali.text(typeId) : bali.NONE,
                    $type: type || bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting to create the type.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        },

        /**
         * This function adds a new message onto the specified queue in the repository.
         * 
         * @param {String} queueId The unique identifier for the queue.
         * @param {String} message The canonical source string for the message.
         */
        queueMessage: async function(queueId, message) {
            try {
                const credentials = await generateCredentials(notary);
                await sendRequest(credentials, '$queueMessage', cloudURL, 'PUT', 'queue', queueId, message);
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$queueMessage',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $queueId: queueId ? bali.text(queueId) : bali.NONE,
                    $message: message || bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting to queue the message.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        },

        /**
         * This function removes a message (at random) from the specified queue in the repository.
         * 
         * @param {String} queueId The unique identifier for the queue.
         * @returns {String} The canonical source string for the message.
         */
        dequeueMessage: async function(queueId) {
            try {
                const credentials = await generateCredentials(notary);
                const message = await sendRequest(credentials, '$dequeueMessage', cloudURL, 'GET', 'queue', queueId);
                return message;
            } catch (cause) {
                const exception = bali.exception({
                    $module: '$CloudRepository',
                    $function: '$dequeueMessage',
                    $exception: '$unexpected',
                    $account: account || bali.NONE,
                    $url: cloudURL || bali.NONE,
                    $queueId: queueId ? bali.text(queueId) : bali.NONE,
                    $text: bali.text('An unexpected error occurred while attempting to dequeue the message.')
                }, cause);
                if (debug) console.error(exception.toString());
                throw exception;
            }
        }

    };
};


// PRIVATE FUNCTIONS

const generateCredentials = async function(notary) {
    const citation = await notary.getCitation();
    const document = bali.duplicate(citation);
    const parameters = document.getParameters();
    parameters.setParameter('$tag', bali.tag());
    parameters.setParameter('$version', bali.version());
    parameters.setParameter('$permissions', '$Private');
    parameters.setParameter('$previous', bali.NONE);
    const credentials = await notary.notarizeDocument(document);
    return credentials;
};


const sendRequest = async function(credentials, functionName, cloudURL, method, type, identifier, document) {

    // analyze the parameters
    switch (type) {
        case 'certificate':
            switch (method) {
                case 'HEAD':
                case 'POST':
                case 'GET':
                    break;
                default:
                    const exception = bali.exception({
                        $module: '$CloudRepository',
                        $function: functionName,
                        $exception: '$invalidParameter',
                        $url: cloudURL || bali.NONE,
                        $method: bali.text(method.toString()),
                        $type: bali.text(type.toString()),
                        $text: bali.text('An invalid method and document type combination was specified.')
                    });
                    throw exception;
            }
            break;
        case 'draft':
            switch (method) {
                case 'HEAD':
                case 'PUT':
                case 'GET':
                case 'DELETE':
                    break;
                default:
                    const exception = bali.exception({
                        $module: '$CloudRepository',
                        $function: functionName,
                        $exception: '$invalidParameter',
                        $method: bali.text(method.toString()),
                        $type: bali.text(type.toString()),
                        $text: bali.text('An invalid method and document type combination was specified.')
                    });
                    throw exception;
            }
            break;
        case 'document':
            switch (method) {
                case 'HEAD':
                case 'POST':
                case 'GET':
                    break;
                default:
                    const exception = bali.exception({
                        $module: '$CloudRepository',
                        $function: functionName,
                        $exception: '$invalidParameter',
                        $method: bali.text(method.toString()),
                        $type: bali.text(type.toString()),
                        $text: bali.text('An invalid method and document type combination was specified.')
                    });
                    throw exception;
            }
            break;
        case 'type':
            switch (method) {
                case 'HEAD':
                case 'POST':
                case 'GET':
                    break;
                default:
                    const exception = bali.exception({
                        $module: '$CloudRepository',
                        $function: functionName,
                        $exception: '$invalidParameter',
                        $method: bali.text(method.toString()),
                        $type: bali.text(type.toString()),
                        $text: bali.text('An invalid method and document type combination was specified.')
                    });
                    throw exception;
            }
            break;
        case 'queue':
            switch (method) {
                case 'PUT':
                case 'GET':
                    break;
                default:
                    const exception = bali.exception({
                        $module: '$CloudRepository',
                        $function: functionName,
                        $exception: '$invalidParameter',
                        $method: bali.text(method.toString()),
                        $type: bali.text(type.toString()),
                        $text: bali.text('An invalid method and document type combination was specified.')
                    });
                    throw exception;
            }
            break;
        default:
            const exception = bali.exception({
                $module: '$CloudRepository',
                $function: functionName,
                $exception: '$invalidParameter',
                $parameter: bali.text(type.toString()),
                $text: bali.text('An invalid document type was specified.')
            });
            throw exception;
    }

    // setup the request URL and options
    const fullURL = cloudURL.getValue().toString() + type + '/' + identifier;
    const options = {
        url: fullURL,
        method: method,
        //timeout: 1000,
        responseType: 'text',
        validateStatus: function (status) {
            return status < 400 || status === 404;  // only flag unexpected server errors
        },
        headers: {
            //'User-Agent': 'Bali Nebula API™ 1.0',
            'Nebula-Credentials': '"' + bali.format(credentials, -1) + '"'  // inlined quoted string
        }
    };

    // add headers for the data (if applicable)
    const data = document ? document.toString() : undefined;
    if (data) {
        options.data = data;
        options.headers['Content-Type'] = 'application/bali';
        options.headers['Content-Length'] = data.length;
    }

    // send the request
    try {
        const response = await axios(options);
        var result;
        switch (method) {
            case 'HEAD':
            case 'DELETE':
                result = (response.status !== 404);
                break;
            default:
                result = response.data || undefined;
            }
        return result;
    } catch (cause) {
        if (cause.response) {
            // the server responded with an error status
            const exception = bali.exception({
                $module: '$CloudRepository',
                $function: functionName,
                $exception: '$invalidRequest',
                $url: bali.reference(options.url),
                $method: bali.text(method),
                $status: cause.response.status,
                $details: bali.text(cause.response.statusText),
                $text: bali.text('The request was rejected by the Bali Nebula™.')
            });
            throw exception;
        }
        if (cause.request) {
            // the request was sent but no response was received
            const exception = bali.exception({
                $module: '$CloudRepository',
                $function: functionName,
                $exception: '$serverDown',
                $url: bali.reference(options.url),
                $method: bali.text(method),
                $status: cause.request.status,
                $details: bali.text(cause.request.statusText),
                $text: bali.text('The request received no response.')
            });
            throw exception;
        } 
        // the request could not be sent
        const exception = bali.exception({
            $module: '$CloudRepository',
            $function: functionName,
            $exception: '$malformedRequest',
            $url: bali.reference(options.url),
            $method: bali.text(options.method),
            $text: bali.text('The request was not formed correctly.')
        });
        throw exception;
    }
};
