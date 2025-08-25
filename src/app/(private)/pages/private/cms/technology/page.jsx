import { Search } from "lucide-react"

export default function TechnologyPage() {
    return (
        <div>
            <h1 className="text-xl font-semibold mb-5">Technology</h1>

            <div className="border border-gray-200 p-5 rounded-xl">
                <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-full flex items-center gap-3 border border-gray-200 rounded-md px-3 py-2">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search technology..."
                            className="w-full outline-none"
                        />
                    </div>
                    <button className="bg-black hover:bg-black/80 text-white px-5 py-2 rounded-md cursor-pointer transition-colors w-full sm:max-w-[15%]">
                        Add Technology
                    </button>
                </div>

                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-sm text-left">
                        <thead className="text-sm uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Technology Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Image
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border-b border-gray-200">
                                <td className="px-6 py-4">
                                    Apple MacBook Pro 17"
                                </td>
                                <td className="px-6 py-4">
                                    Silver
                                </td>
                                <td className="px-6 py-4">
                                    Laptop
                                </td>
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <button className="text-blue-400 bg-blue-100 hover:bg-blue-200 hover:text-blue-500 px-3 py-1 rounded-md text-center cursor-pointer">Edit</button>
                                    <button className="text-red-400 bg-red-100 hover:bg-red-200 hover:text-red-500 px-3 py-1 rounded-md text-center cursor-pointer">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}