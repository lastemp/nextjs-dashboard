import { sql } from "@vercel/postgres";
import {
  CustomerField,
  CustomersTable,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from "./definitions";
import { formatCurrency } from "./utils";
import { customers, invoices, revenue } from "./placeholder-data";
import { unstable_noStore as noStore } from "next/cache";

export async function fetchRevenue() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a reponse for demo purposes.
    // Don't do this in real life :)

    console.log("Fetching revenue data...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    //const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log("Data fetch complete after 3 seconds.");

    //return data.rows;

    // tests only
    // revenue is static data that has been defined in placeholder-data
    return revenue;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    /*
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
    */

    // tests only

    console.log("Fetching latest invoices data...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Data fetch complete after 2 seconds.");

    // invoices is static data that has been defined in placeholder-data
    const latestData = [
      {
        id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
        name: "Delba de Oliveira",
        email: "delba@oliveira.com",
        image_url: "/customers/delba-de-oliveira.png",
        amount: "15,795",
      },
      {
        id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
        name: "Lee Robinson",
        email: "lee@robinson.com",
        image_url: "/customers/lee-robinson.png",
        amount: "20,348",
      },
      {
        id: "3958dc9e-737f-4377-85e9-fec4b6a6442a",
        name: "Hector Simpson",
        email: "hector@simpson.com",
        image_url: "/customers/hector-simpson.png",
        amount: "3,040",
      },
      {
        id: "50ca3e18-62cd-11ee-8c99-0242ac120002",
        name: "Steven Tey",
        email: "steven@tey.com",
        image_url: "/customers/steven-tey.png",
        amount: "54,246",
      },
      {
        id: "3958dc9e-787f-4377-85e9-fec4b6a6442a",
        name: "Steph Dietz",
        email: "steph@dietz.com",
        image_url: "/customers/steph-dietz.png",
        amount: "44,800",
      },
    ];

    return latestData; //invoices.slice(0, 5);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.

    /*
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    
    const numberOfInvoices = Number(data[0].rows[0].count ?? "0");
    const numberOfCustomers = Number(data[1].rows[0].count ?? "0");
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? "0");
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? "0");
    */

    // tests only
    // invoices is static data that has been defined in placeholder-data
    const numberOfInvoices = invoices.length;
    const numberOfCustomers = customers.length;
    const totalPaidInvoices = invoices.filter((x) => x.status == "paid").length;
    const totalPendingInvoices = invoices.filter(
      (x) => x.status == "pending"
    ).length;

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to card data.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    /*
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
    */

    // invoices is static data that has been defined in placeholder-data
    const invoices = [
      {
        id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
        amount: 15795,
        date: "2022-12-06",
        status: "pending",
        name: "Delba de Oliveira",
        email: "delba@oliveira.com",
        image_url: "/customers/delba-de-oliveira.png",
      },
      {
        id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
        amount: 20348,
        date: "2022-11-14",
        status: "pending",
        name: "Lee Robinson",
        email: "lee@robinson.com",
        image_url: "/customers/lee-robinson.png",
      },
      {
        id: "3958dc9e-737f-4377-85e9-fec4b6a6442a",
        amount: 3040,
        date: "2022-10-29",
        status: "paid",
        name: "Hector Simpson",
        email: "hector@simpson.com",
        image_url: "/customers/hector-simpson.png",
      },
      {
        id: "50ca3e18-62cd-11ee-8c99-0242ac120002",
        amount: 44800,
        date: "2023-09-10",
        status: "paid",
        name: "Steven Tey",
        email: "steven@tey.com",
        image_url: "/customers/steven-tey.png",
      },
      {
        id: "3958dc9e-787f-4377-85e9-fec4b6a6442a",
        amount: 34577,
        date: "2023-08-05",
        status: "pending",
        name: "Steph Dietz",
        email: "steph@dietz.com",
        image_url: "/customers/steph-dietz.png",
      },
      {
        id: "76d65c26-f784-44a2-ac19-586678f7c2f2",
        amount: 54246,
        date: "2023-07-16",
        status: "pending",
        name: "Michael Novotny",
        email: "michael@novotny.com",
        image_url: "/customers/michael-novotny.png",
      },
      {
        id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
        amount: 667,
        date: "2023-06-27",
        status: "pending",
        name: "Evil Rabbit",
        email: "evil@rabbit.com",
        image_url: "/customers/evil-rabbit.png",
      },
      {
        id: "126eed9c-c90c-4ef6-a4a8-fcf7408d3c66",
        amount: 32545,
        date: "2023-06-09",
        status: "paid",
        name: "Emil Kowalski",
        email: "emil@kowalski.com",
        image_url: "/customers/emil-kowalski.png",
      },
      {
        id: "CC27C14A-0ACF-4F4A-A6C9-D45682C144B9",
        amount: 1250,
        date: "2023-06-17",
        status: "paid",
        name: "Amy Burns",
        email: "amy@burns.com",
        image_url: "/customers/amy-burns.png",
      },
      {
        id: "13D07535-C59E-4157-A011-F8D2EF4E0CBB",
        amount: 8546,
        date: "2023-06-07",
        status: "paid",
        name: "Balazs Orban",
        email: "balazs@orban.com",
        image_url: "/customers/balazs-orban.png",
      },
    ];

    return invoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    /*
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;
  */

    //const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    const totalPages = Math.ceil(Number(invoices.length) / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    /*
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
    */

    /*
    function isInvoices(invoice) {
      return invoice.customer_id === id;
    }

    const myinvoices = invoices.find(isInvoices);
    */
    //console.log("id:" + id);
    const myinvoices: InvoiceForm = {
      //id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
      id: id,
      customer_id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
      amount: 15795,
      status: "pending",
    };

    return myinvoices;
  } catch (error) {
    console.error("Database Error:", error);
  }
}

export async function fetchCustomers() {
  noStore();
  try {
    /*
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    */
    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  try {
    const data = await sql<CustomersTable>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}

export async function getUser(email: string) {
  noStore();
  try {
    const user = await sql`SELECT * from USERS where email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}
