import React, { FC, FormEvent, useEffect, useRef, useState } from 'react';
import BookIcon from '@material-ui/icons/Book';
import Button from '@material-ui/core/Button';
import CircularProgress  from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { fileToBase64 } from 'util/file/fileToBase64';

const useStyles = makeStyles(
    (theme) => ({
        /* Styles applied to the root element. */
        root: {},
        input: {
            display: 'none',
        },
    }),
    { name: 'UploadPdf' },
);

type Props = {
    onUpload: (base64: string) => void;
};

export const UploadPdf: FC<Props> = (props) => {
    const { onUpload } = props;
    const classes = useStyles();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setUploading] = useState(false);

    const handleChange = (e: FormEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;

        const file = files && files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleActivator = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    useEffect(() => {
        async function convertToBase64() {
            if (!selectedFile) {
                return;
            }

            try {
                setUploading(true);
                const base64 = await fileToBase64(selectedFile);

                onUpload(base64);
            } catch (err) {
                console.log(err);
            } finally {
                setUploading(false);
            }
        }

        convertToBase64();
    }, [selectedFile]);

    return (
        <div className={classes.root}>
            <input
                className={classes.input}
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleChange}
            />

            <Button
                onClick={handleActivator}
                startIcon={<BookIcon />}
                endIcon={isUploading ? <CircularProgress size={16} /> : null}
            >
                Выбрать книгу
            </Button>
        </div>
    );
};
