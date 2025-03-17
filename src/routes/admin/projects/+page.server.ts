import { createProject, deleteProject, getProjects } from '$lib/prisma';
import type { FormDeleteProject, FormProject } from '@/models/voucher.models';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { makeNewProject } from '@/helpers/voucher.helpers';
import { formDataToJson } from '@/helpers/form.helpers';

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
		const newProject = makeNewProject(formProject);
		if (!newProject.name) {
			return fail(400, { name: formProject.name, nameMissing: true });
		}
		if (!newProject.number) {
			return fail(400, { number: formProject.number, numberMissing: true });
		}
		const project = await createProject(newProject);
		return { project };
	},
	remove: async ({ request }) => {
		const data = await request.formData();
		const { number } = formDataToJson<FormDeleteProject>(data);
		try {
			const project = await deleteProject(parseInt(number));
			return { project };
		} catch {
			return fail(400, { number, exists: false });
		}
	}
};
