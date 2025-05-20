import { useLoaderData } from "react-router";

const Donations = () => {

    const data = useLoaderData()
    const {donations} = data
    console.log(donations)
    return (
        <div>
            <h1 className="text-3xl">This Is Donations Page {donations.length}</h1>
            <h2>Fucl</h2>
        </div>
    );
};

export default Donations;