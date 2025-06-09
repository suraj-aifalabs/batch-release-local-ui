import CustomContainer from "@/custom_components/CustomContainer"
import { CustomFileUploader } from "@/custom_components/CustomFileUploader";
import { uploadQCTemplate } from "@/services/apiService";
import { useEffect, useState } from "react";

const QCManagement = () => {
    const [files, setFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 1,
        maxSize: 1024 * 1024 * 50,
        multiple: false,
    };

    console.log("files", files)

    const triggerUpload = async (formData: FormData) => {
        await uploadQCTemplate(formData)
    }

    useEffect(() => {
        if (files && files?.length > 0) {
            const formData = new FormData();
            formData.append('file', files[0]);
            formData.append('batch_number', "Cert_Template");
            formData.append('file_name', "QC");

            triggerUpload(formData)
        }
    }, [files])


    return (
        <CustomContainer >
            <CustomFileUploader
                placeholder="Click to Upload QC Template"
                files={files}
                setFiles={setFiles}
                dropZoneConfig={dropZoneConfig}
            />
        </CustomContainer>
    )
}

export default QCManagement
