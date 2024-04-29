import { ReactNode } from "react";
import Container from "./Container";

// TIP: If you want words to be highlighted use JSX in the prop
// and wrap the word in <mark> tags
const PageHeader = ({ title, tagline, summary, children }: PageHeaderProps) => (
  <section>
    <Container className="pb-16 pt-20">
      <header className="font-brand sm:pr-0 lg:max-w-6xl">
        {tagline && <p className="text-amber-200">{tagline}</p>}
        <h1 className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-4xl text-transparent [text-wrap:balance] lg:text-5xl">
          {title}
        </h1>
        {summary && <p className="mt-4 max-w-4xl text-base text-gray-400 [text-wrap:balance]">{summary}</p>}
      </header>
      {children}
    </Container>
  </section>
);

type PageHeaderProps = {
  children?: ReactNode;
  title: string | ReactNode;
  tagline?: string;
  summary?: string | ReactNode;
};

export default PageHeader;
