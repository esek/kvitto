import { getFortnoxApiClient } from '$lib/fortnox';
import { PrismaClient, type Project } from '@prisma/client';
import { getProjects } from '$lib/prisma';
import type { RequestHandler } from './$types';
import { manageError } from '@/helpers/fortnox.helpers';
import type { FortnoxProjectsResponse } from '@/models/fortnox.models';

export const GET: RequestHandler = async ({ fetch }) => {
	const fortnoxApi = getFortnoxApiClient(fetch);

	const { data, error } = await fortnoxApi.GET('/3/projects', {
		params: { query: { limit: 500 } } as unknown as {}
	});

	if (!data || error) {
		return manageError(error);
	}

	const fortnoxData = data as FortnoxProjectsResponse;
	const pagination = fortnoxData.MetaInformation;
	if (pagination['@TotalPages'] > 1) {
		for (let page = 2; page <= pagination['@TotalPages']; page++) {
			const { data: pageData, error: pageError } = await fortnoxApi.GET('/3/projects', {
				params: { query: { limit: 500, page } } as unknown as {}
			});
			if (!pageData || pageError) {
				return manageError(pageError);
			}
			const fortnoxPageData = pageData as FortnoxProjectsResponse;
			fortnoxData.Projects.push(...fortnoxPageData.Projects);
		}
	}

	const oldProjects = await getProjects();

	const projects: Project[] = fortnoxData.Projects.filter((p) => p.Status === 'ONGOING').map(
		(p) => {
			const oldDescription = oldProjects.find(
				(op) => op.number.toString() === p.ProjectNumber
			)?.name;
			const project: Project = {
				number: p.ProjectNumber ? parseInt(p.ProjectNumber) : 0,
				name: oldDescription ?? p.Description
			};
			return project;
		}
	);

	const prismaClient = new PrismaClient();
	await prismaClient.$transaction(
		projects.map((project) =>
			prismaClient.project.upsert({
				where: { number: project.number },
				update: { name: project.name },
				create: project
			})
		)
	);
	return new Response('Synced projects with fortnox!', { status: 200 });
};
