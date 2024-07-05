// const readBytes = (buffer: Buffer, start: number, length: number) => {
//     return buffer.slice(start, start + length)
// }

import { FetchError } from "./errors"
import { serverHost } from "./vars"

const API = {
    extractTagsURI: "v1/upload/extractTags", 
    extractTags: async (image: File) => {
        if (image == null) {
            throw new Error("No image provided")
        }
        console.table(
            {
                "type": image.type,
                "size": image.size,
                "name": image.name,
                "lastModified": image.lastModified,
            }
        )
        console.log("Sending image to", `${serverHost}/${API.extractTagsURI}`)
        const formData = new FormData()
        formData.append("file", image)
        console.log("formData", formData)

        const response = await fetch(`${serverHost}/${API.extractTagsURI}`, {
            method: "POST",
            headers: {
                // "Content-Type": "application/json",
                // set timeout
                "Accept": "application/json",
                "Content-Type": `image/${image.type}`,
            },
            // body: image,
            body: formData,
            // body: JSON.stringify({ file: image }),
        })
        if (!response.ok) {
            throw new FetchError(`Unable to fetch tags (${response.status} - ${await response.text()})`)
        }
        return response.json()
    }
}

export class ImageUtils {
    static async extractStableDifusionTags(image: any, callback?: (tags: {
        tags: string[]
    }) => void) {
        // go to address 00000020 and read 10 bytes
        const API_tags = await API.extractTags(image)
        console.log("API_tags", API_tags)

        let tags = []
        console.log("image", image)

        if (image?.tEXt) {
            tags = image.tEXt.filter((t: any) => t.keyword === "tEXtparameters")
        }

        if (callback) {
            callback(tags)
        }
        return tags
    }
}