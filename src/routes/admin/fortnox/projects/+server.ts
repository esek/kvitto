import { getFortnoxApiClient } from '$lib/fortnox';
import { PrismaClient, type Project } from '@prisma/client';
import { getProjects } from '$lib/prisma';
import type { RequestHandler } from './$types';
import { manageError } from '@/helpers/fortnox.helpers';

export const GET: RequestHandler = async ({ fetch }) => {
	const fortnoxApi = getFortnoxApiClient(fetch);

	const { data, error } = await fortnoxApi.GET('/3/projects', {
		params: { query: { limit: 500 } } as unknown as {}
	});

	if (!data || error) {
		return manageError(error);
	}

	if (!data.Projects) {
		return new Response('Found no fortnox projects.', { status: 404 });
	}

	const oldProjects = await getProjects();

	const projects: Project[] = data.Projects.filter((p) => p.Status === 'ONGOING').map((p) => {
		const oldDescription = oldProjects.find((op) => op.number.toString() === p.ProjectNumber)?.name;
		const project: Project = {
			number: p.ProjectNumber ? parseInt(p.ProjectNumber) : 0,
			name: oldDescription ?? p.Description
		};
		return project;
	});

	const prismaClient = new PrismaClient();
	prismaClient.$transaction([
		prismaClient.project.deleteMany(),
		prismaClient.project.createMany({ data: projects })
	]);
	return new Response('Synced projects with fortnox!', { status: 200 });
};
