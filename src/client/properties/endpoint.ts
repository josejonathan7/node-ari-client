/* eslint-disable @typescript-eslint/no-explicit-any */


interface IGetParams {
	tech: string;
	resource: string;
}

export interface IEndpoints {
	get (params: IGetParams, mountSwaggerPromise: (data: any) => any): Promise<(data: any) => any>;
}

export class Endpoint implements IEndpoints {
	private readonly knownType = "endpoints";

	constructor() {

	}

	get (params: IGetParams, mountSwaggerPromise: (data: any) => any) {
		if (!params) {
			throw new Error("param faltou");
		}

		if (typeof params.tech !== "string" || !params.tech.trim()) {
			throw new Error("tech is required");
		}

		if (typeof params.resource !== "string" || !params.resource.trim()) {
			throw new Error("resource is required");
		}

		const pathParams = `/${encodeURIComponent(params.tech)}/${encodeURIComponent(params.resource)}`;

		return mountSwaggerPromise({
			httpMethod: "GET",
			pathParams,
			resource: this.knownType,
		});
	}
}

// #mountEndpointProperty () {
//     const knownType = "endpoints"
//     /**
//      * @param {Object} params
//      * @param {string} params.tech
//      * @param {string} params.resource
//      */
//     this[knownType]["get"] = (params) => {
//         if (!params) {
//           throw new Error("param faltou")
//         }

//         if (typeof params.tech !== "string" || !params.tech.trim()) {
//           throw new Error("tech is required")
//         }

//         if (typeof params.resource !== "string" || !params.resource.trim()) {
//           throw new Error("resource is required")
//         }

//         const pathParams = `/${encodeURIComponent(params.tech)}/${encodeURIComponent(params.resource)}`;

//         return this.#mountSwaggerPromise({
//           httpMethod: "GET",
//           pathParams,
//           resource: knownType,
//         });
//     }

//     /**
//      * @param {Object} params
//      * @param {string} params.tech
//      * @returns {Promise<Array>} array de endpoints
//      */
//     this[knownType]["listByTech"] = (params) => {
//       if (!params || !params.tech) {
//         return this.#mountSwaggerPromise({
//           httpMethod: "GET",
//           pathParams: "/PJSIP",
//           resource: "endpoints"
//         });
//       }

//       const pathParams = `/${encodeURIComponent(params.tech)}`;
//       return this.#mountSwaggerPromise({
//         httpMethod: "GET",
//         pathParams,
//         resource: knownType
//       });
//     }

//     /**
//      * @return {Promise<Array>}
//      */
//     this[knownType]["list"] = () => this.#mountSwaggerPromise({
//       httpMethod: "GET",
//       resource: knownType
//     });

//     /**
//      * @param {Object} params
//      * @param {string} params.to
//      * @param {string} params.from
//      * @param {string | undefined} params.body
//      */
//     this[knownType]["sendMessage"] = (params) => {
//       if (typeof params !== "object") {
//         throw new Error("param object is required");
//       }

//       if (params.body) {
//         if (typeof params.body !== "string" || !params.body.trim()) {
//           throw new Error("body is string type");
//         }
//       }

//       if (typeof params.from !== "string" || !params.from.trim()) {
//         throw new Error("from is required");
//       }

//       if (typeof params.to !== "string" || !params.to.trim()) {
//         throw new Error("to is required");
//       }

//       const url = `endpoints/sendMessage`;
//       const body = params.body ? "&body=".concat(encodeURIComponent(params.body)) : ""
//       const queryParams = `?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}${body}`
//       return this.#mountSwaggerPromise({
//         httpMethod: "PUT",
//         queryParams,
//         resource: url
//       })
//     }

//     /**
//      * @param {Object} params
//      * @param {string} params.resource
//      * @param {string} params.tech
//      * @param {string} params.from
//      * @param {string | undefined} params.body
//      */
//     this[knownType]["sendMessageToEndpoint"] = (params) => {
//       if (typeof params !== "object") {
//         throw new Error("param object is required");
//       }

//       if (params.body) {
//         if (typeof params.body !== "string" || !params.body.trim()) {
//           throw new Error("body is string type");
//         }
//       }

//       if (typeof params.from !== "string" || !params.from.trim()) {
//         throw new Error("from is required")
//       }

//       if (typeof params.resource !== "string" || !params.resource.trim()) {
//         throw new Error("resource is required")
//       }

//       if (typeof params.tech !== "string" || !params.tech.trim()) {
//         throw new Error("tech is required")
//       }

//       const url = `endpoints/${encodeURIComponent(params.tech)}/${encodeURIComponent(params.resource)}/sendMessage`
//       const body = params.body ? "&body=".concat(encodeURIComponent(params.body)) : ""

//       const queryParams = `?from=${encodeURIComponent(params.from)}${body}`
//       return this.#mountSwaggerPromise({
//         httpMethod: "PUT",
//         queryParams,
//         resource: url
//       })
//     }
//   }
