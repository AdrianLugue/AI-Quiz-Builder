"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


const UploadDoc = () =>{
    const [document, setDocument] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        if (!document) {
            setError("Please upload a document");
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("pdf", document as Blob);
        try {
            const res = await fetch("/api/Quiz/Generate", {
                method: "POST",
                body: formData
            });
            if (res.status === 200 ){
                const data = await res.json();
                const quizId = data.quizId;
                router.push(`/Quiz/${quizId}`);
            } else {
                const data = await res.json();
                setError(data.error || `Server responded with status ${res.status}`);
            }
        }catch(e: any){
            console.error("error while generating:", e);
            setError(e.message || "An unexpected error occurred");
        }
        setIsLoading(false);
    }


    return(
        <div className="w-full">
            {isLoading ? <p>Loading...</p> : <form className="w-full" onSubmit={handleSubmit}>
                <label htmlFor="document" className="bg-secondary w-full flex h-20 rounded-md border-4 border-dashed border-blue-900 relative"> 
                 <div className=" absolute inset-0 m-auto flex justify-center items-center">
                    {document && document?.name ? document.name : "Drag a file"}
                 </div>   
                 
                <input type="file" className="relative bloc w-full h-full z-50 opacity-0 " id="document" onChange={e => setDocument(e.target.files?.[0] || null)}/>
                </label> 
                {error ? <p className="text-red-500">{error}</p> : null}
                <Button type="submit" className="mt-4">Generate Quiz</Button>
            </form>}
        </div>
    )
}
export default UploadDoc;