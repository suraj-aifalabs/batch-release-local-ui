import {
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
    FileInput,
} from "@/components/ui/FileUploader";
import { Paperclip } from "lucide-react";
import { RiUpload2Line } from "@remixicon/react";
import { DropzoneOptions } from "react-dropzone";
// Define the props for the CustomFileUploader
interface CustomFileUploaderProps {
    files: File[] | null;
    setFiles: (value: File[] | null) => void;
    dropZoneConfig: DropzoneOptions;
    placeholder?: string;
}

export function CustomFileUploader({ files, setFiles, dropZoneConfig, placeholder = "" }: CustomFileUploaderProps) {
    return (
        <div>
            <FileUploader
                value={files}
                onValueChange={setFiles}
                dropzoneOptions={dropZoneConfig}
                className="relative bg-background outline-1 outline-dashed outline-gray-600 p-2"
            >
                <FileInput>
                    <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                        <RiUpload2Line />
                        {placeholder}
                        <p className="text-blue-600">or drag and drop</p>
                        <br />
                        <p className="mt-2 text-gray-600">Supported format: .pdf, .docx (Max: 50MB)</p>
                    </div>
                </FileInput>
                <FileUploaderContent>
                    {files && files.length > 0 && files.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                        </FileUploaderItem>
                    ))}
                </FileUploaderContent>
            </FileUploader>
        </div>
    );
}
