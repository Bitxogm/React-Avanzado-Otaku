// import ProjectForm from "@/components/forms/ProjectForm";
import ProjectOptimisticForm from "@/components/forms/ProjectOptimisticForm";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/projects";
import { Metadata } from "next";
import Link from "next/link";

// export const dynamic = "force-dynamic";

type SearchParamValue = string | string[] | undefined;

type DashboardPageSearchParams = Promise<Record<string, SearchParamValue>>;

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard de proyectos",
};

export default async function DashboardPage(props: { params: Promise<Record<string, string>>, searchParams: DashboardPageSearchParams }) {
  const searchParams = await props.searchParams;

  console.log("Search params:", searchParams);

  const order = searchParams.sort === "desc" ? "desc" : "asc";
  const projects = await getProjects({ order });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>
        Bienvenido al dashboard. Si ves esto, es porque tienes la cookie de
        autenticación.
      </p>
      <Link href="/dashboard/form" className="inline-block px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg transition-all cursor-pointer mt-4">
        Ir al formulario
      </Link>

      {/* <ProjectForm /> */}
      <ProjectOptimisticForm />

      <div className="mt-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            createdAt={project.createdAt}
            updatedAt={project.updatedAt}
          />
        ))}
      </div>
    </div>
  );
}
