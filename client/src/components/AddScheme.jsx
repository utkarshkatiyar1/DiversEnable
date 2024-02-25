import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { Alert, Button, FileInput, TextInput, Textarea } from 'flowbite-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useNavigate } from 'react-router-dom';

const AddScheme = () => {
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const navigate = useNavigate();

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError('Please select an image');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError('Image upload failed');
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({ ...formData, Logo: downloadURL });
                    });
                }
            );
        } catch (error) {
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
            
            console.log(error);
        }
    };

    const handleAddJob = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/scheme/createscheme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);
            if (!res.ok) {
                setImageUploadError(data.message);
                return;
            }
            if (res.ok) {
                setPublishError(null);
                navigate('/');
                console.log('Job added successfully');  
                // setFormData({});
            }

        } catch (error) {
            setImageUploadError('Something went wrong');
        }
    };

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen text-center m-auto '>
            <h2 className=' m-5 text-2xl' >Add Government Scheme</h2>


            <form onSubmit={handleAddJob}>

            <div className='flex gap-2 w-3/5 m-auto items-center justify-between border-4 border-teal-500 p-3 mb-5'>
                    <label>Upload Logo</label>
                    <FileInput type="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button
                        type='button'
                        gradientDuoTone='purpleToBlue'
                        size='sm'
                        outline
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {imageUploadProgress ? (
                            <div className='w-16 h-16'>
                                <CircularProgressbar
                                    value={imageUploadProgress}
                                    text={`${imageUploadProgress || 0}%`}
                                />
                            </div>
                        ) : (
                            'Upload Image'
                        )}
                    </Button>
                </div>
                {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                {formData.Logo && (
                    <img
                        src={formData.Logo}
                        alt='upload'
                        className='w-full h-72 object-cover'
                    />
                )}
                <div className=' mb-5'>
                    <label>Title</label>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        id='title'
                        className='flex-1 '
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                </div>
              
                
                <div className=' mb-5'>
                    <label>Description:</label>
                    <Textarea
                        placeholder='Description'
                        required
                        id='description'
                        className='flex-1'
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                    ></Textarea>
                </div>
                <div className=' mb-5'>
                    <label>Benefits:</label>
                    <Textarea
                        placeholder='benefits'
                        required
                        id='benefits'
                        className='flex-1'
                        onChange={(e) =>
                            setFormData({ ...formData, benefits: e.target.value })
                        }
                    ></Textarea>
                </div>
               
                <div className=' mb-5'>
                    <label> Eligibility </label>
                    <TextInput
                        type='text'
                        placeholder='eligibility'
                        required
                        id='eligibility'
                        className='flex-1'
                        onChange={(e) =>
                            setFormData({ ...formData, eligibility: e.target.value })
                        }
                    />
                </div>
                <div className=' mb-5'>
                    <label> Application Process </label>
                    <Textarea
                        type='text'
                        placeholder='process'
                        required
                        id='process'
                        className='flex-1'
                        onChange={(e) =>
                            setFormData({ ...formData, process: e.target.value })
                        }
                    />
                </div>
                <div className=' mb-5'>
                    <label> How To Apply </label>
                    <Textarea
                        type='text'
                        placeholder='write here method to apply'
                        required
                        id='applyMethod'
                        className='flex-1'
                        onChange={(e) =>
                            setFormData({ ...formData, applyMethod: e.target.value })
                        }
                    />
                </div>
                <div className=' mb-5'>
                    <label> Apply DeadLine </label>
                    <Textarea
                        type='date'
                        placeholder='applyDeadline'
                        required
                        id='applyDeadline'
                        className='flex-1'
                        onChange={(e) =>
                            setFormData({ ...formData, applyDeadline: e.target.value })
                        }
                    />
                </div>
                <div className=' mb-5'>
                    <label> Apply Link </label>
                    <Textarea
                        type='text'
                        placeholder='applyLink'
                        required
                        id='applyLink'
                        className='flex-1'
                        onChange={(e) =>
                            setFormData({ ...formData, applyLink: e.target.value })
                        }
                    />
                </div>

               
                <button type="submit" className=' border-blue-700 rounded-xl border-4 w-44 p-3 m-2'>Add Job</button>
                {publishError && (
                    <Alert className='mt-5' color='failure'>
                        {publishError}
                    </Alert>
                )}
            </form>
        </div>
    );
};

export default AddScheme;
