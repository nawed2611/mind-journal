import util from "util";
import connection from "../db.js";

const create = async (req, res) => {
    connection.connect();
    const query = util.promisify(connection.query).bind(connection);

    // get the journals of a id 
    const rows = await query(`SELECT * FROM journal WHERE id = '${req.body.id}'`,);

    // create prompt template using langchain for image generation
    const prompt = `# ${rows[0].title}\n\n${rows[0].content}\n\n${rows[0].date}`;

    // create image using langchain
    const image = await fetch("https://api.langchain.com/v1/image", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.LANGCHAIN_API_KEY}`,
        },
        body: JSON.stringify({
            prompt,
            engine: "davinci",
            max_tokens: 100,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ["\n\n"],
        }),
    }).then((res) => res.json());

    // return the image url 
    const image_url = image.generated_image;

    // update the journal with the image url
    const update = await query(
        `UPDATE journal SET image_url = '${image_url}' WHERE id = ${req.body.id} `,
    );

    res.send(update);
};

export default {
    findMultiple,
    findOne,
    create,
};
