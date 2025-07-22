import { createProject, deleteProject, getProjects } from '$lib/prisma';
import type { FormProject } from '@/models/voucher.models';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { formDataToJson, success } from '@/helpers/form.helpers';
import { projectSchema } from '@/models/zod.models';
import { makeProject } from '$lib/voucher';
import { formatZodErrors } from '@/helpers/zod.helpers';

export const load = (async () => {
	const projects = await getProjects();
	return {
		projects
	};
}) satisfies PageServerLoad;

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const formProject = formDataToJson<FormProject>(data);
		const newProject = makeProject(formProject);
		const schema = await projectSchema.safeParseAsync(newProject);
		if (schema.error) {
			return fail(400, formatZodErrors(schema.error));
		}
		const project = await createProject(newProject);
		return success('Projekt skapat!', project.number + ' | ' + project.name);
	},
	remove: async ({ request }) => {
		const data = await request.formData();
		const { number } = formDataToJson<FormProject>(data);
		try {
			const project = await deleteProject(parseInt(number));
			return success('Projekt raderat!', project.number + ' | ' + project.name);
		} catch {
			return fail(400);
		}
	}
};
