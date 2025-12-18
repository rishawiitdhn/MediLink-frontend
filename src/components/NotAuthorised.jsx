export default function NotAuthorised(){
    return (
        <>
        <div className="flex flex-col p-10">
            <p className="text-4xl font-bold">Error: 401</p>
            <p className="font-serif text-2xl">Sorry, You are not authorised for this page</p>
        </div>
        </>
    )
}