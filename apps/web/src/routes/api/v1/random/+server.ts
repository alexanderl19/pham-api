import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { client } from '$lib/sanity/client.server';
import groq from 'groq';

export const GET = (async () => {
	const count = await client.fetch<number>(
		groq`count(*[_type == "photo" && !(_id in path("drafts.**")) && hide == false])`
	);

	const random = Math.floor(Math.random() * count);
	const randomPhoto = await client.fetch<{ _id: string }>(
		groq`
			*[_type == "photo" && hide == false && !(_id in path("drafts.**"))][$random] {
				_id
			}
		`,
		{ random }
	);

	return json(
		{
			src: new URL(`photos/${randomPhoto._id}`, PUBLIC_BASE_URL).toString()
		},
		{
			headers: {
				'Access-Control-Allow-Origin': '*'
			}
		}
	);
}) satisfies RequestHandler;
