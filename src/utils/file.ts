
export async function getBase64(file: Blob) {
	return new Promise<String | ArrayBuffer | null>( (resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			resolve(reader.result);
		}
		reader.onerror = (error) => {
			reject(error);
		}
	} );
}