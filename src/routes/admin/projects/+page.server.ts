import { FormProjectNames, type FormProject, type JsonFormProject } from '@/models/voucher.models';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { formDataToJson, stringToJson, success } from '@/helpers/form.helpers';
import { projectSchema } from '@/models/zod.models';
import { makeProject } from '$lib/voucher';
import { formatZodErrors } from '@/helpers/zod.helpers';
import { getProjects, updateProject } from '$lib/prisma';

export const load = (async () => {
	const projects = await getProjects();
	return {
		projects
	};
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ request }) => {
		const data = await request.formData();
		const jsonFormProject = formDataToJson<JsonFormProject>(data);
		const formUpdatedProject = stringToJson<FormProject>(jsonFormProject.project);
		if (!formUpdatedProject) {
			return fail(400, { errors: [{ message: 'Ogiltig projektdata' }] });
		}
		const updatedProject = makeProject(formUpdatedProject);
		const schema = await projectSchema.safeParseAsync(updatedProject);
		if (schema.error) {
			return fail(400, formatZodErrors(schema.error, updatedProject.number.toString()));
		}

		const projects = await getProjects();
		const occupiedProj = projects.find((p) => p.name === updatedProject.name);
		if (occupiedProj) {
			return fail(400, {
				errors: [
					{
						field: FormProjectNames.NAME + updatedProject.number,
						message: 'Projektnamnet är upptaget av projekt ' + occupiedProj.number + '.'
					}
				]
			});
		}
		const project = await updateProject(updatedProject);
		return success('Projektnamn sparat!', project.number + ' | ' + project.name);
	}
};
