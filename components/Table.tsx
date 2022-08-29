import React, { ReactElement, useState } from "react";
import clsx from "clsx";
// Option for header - on/off + data

// Row data
// Expanded

const Row = ({
  className,

  rowData,
}: {
  className?: string;
  rowData: any;
}): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className={className}>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          {rowData.name}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {rowData.title}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {rowData.email}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {rowData.role}
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Details<span className="sr-only">, {rowData.name}</span>
          </button>
        </td>
      </tr>

      <tr className="w-full bg-slate-500">
        <td colSpan={5}>
          <div
            className={clsx(
              "grid grid-flow-row overflow-hidden",
              !expanded && "h-0"
            )}
          >
            <p>This is some content</p>
            <p>This is some content</p>
            <p>This is some content</p>
          </div>
        </td>
      </tr>
    </>
  );
};

const Table = () => {
  const people = [
    {
      name: "Lindsay Walton",
      title: "Front-end Developer",
      email: "lindsay.waltson@example.com",
      role: "Member",
    },
    {
      name: "Lindsay Walton",
      title: "Front-end Developer",
      email: "lindsay.walton@example.com",
      role: "Member",
    },
    {
      name: "Lindsay Walton",
      title: "Front-end Developer",
      email: "lindsay.wadlton@example.com",
      role: "Member",
    },
    {
      name: "Lindsay Walton",
      title: "Front-end Developer",
      email: "lindsay.waslton@example.com",
      role: "Member",
    },
  ];

  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="sr-only bg-gray-50">
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
          >
            Name
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Title
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Email
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Role
          </th>
          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {people.map((person, personIdx) => (
          <Row
            key={person.email}
            rowData={person}
            className={personIdx % 2 === 0 ? "" : "bg-gray-50"}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Table;
