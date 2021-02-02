const Mask = {
    apply(input, func) {
        setTimeout(function () {
            input.value = Mask[func](input.value);
        }, 1);
    },
    formatBRL(value) {
        value = value.replace(/\D/g, "");
        return (value = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value / 100));
    },
    cpfCnpj(value) {
        value = value.replace(/\D/g, "");

        if (value.length > 14) {
            value = value.slice(0, -1);
        }

        if (value.length > 11) {
            //11223344556677 - CNPJ

            //11.223344556677
            value = value.replace(/(\d{2})(\d)/, "$1.$2");
            //11.223.344556677
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            //11.223.344/556677
            value = value.replace(/(\d{3})(\d)/, "$1/$2");
            //11.223.344/5566-77
            value = value.replace(/(\d{4})(\d)/, "$1-$2");
        } else {
            //11233455678 - CPF

            //112.33455678
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            //112.334.55678
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            //112.334.556/78
            value = value.replace(/(\d{3})(\d)/, "$1/$2");
        }
        return value;
    },
    cep(value) {
        value = value.replace(/\D/g, "");

        if (value.length > 8) {
            value = value.slice(0, -1);
        }
        value = value.replace(/(\d{5})(\d)/, "$1-$2");
        return value;
    },
};

const photosUpload = {
    input: "",
    preview: document.querySelector("#photos-preview"),
    uploadLimit: 6,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target;
        photosUpload.input = event.target;

        if (photosUpload.hasLimit(event)) return;

        Array.from(fileList).forEach((file) => {
            photosUpload.files.push(file);

            const reader = new FileReader();

            reader.onload = () => {
                const image = new Image();
                image.src = String(reader.result);

                const div = photosUpload.getContainer(image);
                photosUpload.preview.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
        photosUpload.input.files = photosUpload.getAllFiles();
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = photosUpload;
        const { files: fileList } = input;

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`);
            event.preventDefault();
            return true;
        }

        const photoDiv = [];
        preview.childNodes.forEach((item) => {
            if (item.classList && item.classList.value == "photo")
                photoDiv.push(item);
        });

        const totalPhotos = fileList.length + photoDiv.length;
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos");
            event.preventDefault();
            return true;
        }

        return false;
    },
    getAllFiles() {
        const dataTransfer =
            new ClipboardEvent("").clipboardData || new DataTransfer();

        photosUpload.files.forEach((file) => dataTransfer.items.add(file));

        return dataTransfer.files;
    },
    getContainer(image) {
        const div = document.createElement("div");
        div.classList.add("photo");

        div.onclick = photosUpload.removePhoto;

        div.appendChild(image);

        div.appendChild(photosUpload.getRemoveButton());

        return div;
    },
    getRemoveButton() {
        const button = document.createElement("i");
        button.classList.add("material-icons");
        button.innerHTML = "close";
        return button;
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode; // <div class="photo">
        const photosArray = Array.from(photosUpload.preview.children);
        const index = photosArray.indexOf(photoDiv);

        photosUpload.files.splice(index, 1);
        photosUpload.input.files = photosUpload.getAllFiles();

        photoDiv.remove();
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode;

        if (photoDiv.id) {
            const removedFiles = document.querySelector(
                'input[name="removed_files"]'
            );
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`;
            }
        }

        photoDiv.remove();
    },
};

const imageGallery = {
    highlight: document.querySelector(".gallery .highlight > img"),
    previews: document.querySelectorAll(".gallery-preview img"),

    setImage(e) {
        const { target } = e;
        imageGallery.previews.forEach((preview) =>
            preview.classList.remove("active")
        );
        target.classList.add("active");

        imageGallery.highlight.src = target.src;
        lightbox.image.src = target.src;
    },
};

const lightbox = {
    target: document.querySelector(".lightbox-target"),
    image: document.querySelector(".lightbox-target img"),
    closeButtom: document.querySelector(".lightbox-target a.lightbox-close"),
    open() {
        lightbox.target.style.opacity = 1;
        lightbox.target.style.top = 0;
        lightbox.target.style.bottom = 0;
        lightbox.closeButtom.style.top = 0;
    },
    close() {
        lightbox.target.style.opacity = 0;
        lightbox.target.style.top = "-100%";
        lightbox.target.style.bottom = "initial";
        lightbox.closeButtom.style.top = "-80px";
    },
};

const Validate = {
    apply(input, func) {
        Validate.clearErrors(input);
        let results = Validate[func](input.value);
        input.value = results.value;

        if (results.error) {
            Validate.displayError(input, results.error);
        }
    },
    displayError(input, error) {
        const div = document.createElement("div");
        div.classList.add("error");
        div.innerHTML = error;
        input.parentNode.appendChild(div);
        input.focus();

        setTimeout(function () {
            input.focus();
        }, 1);
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector(".error");
        if (errorDiv) errorDiv.remove();
    },
    isEmail(value) {
        let error = null;
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!value.match(mailFormat)) {
            error = "Email inválido!!";
        }

        return {
            error,
            value,
        };
    },
    isCpfCnpj(value) {
        let error = null;
        const cleanValues = value.replace(/\D/g, "");

        if (cleanValues.length > 11 && cleanValues.length !== 14) {
            error = "CNPJ incorreto";
        } else if (cleanValues.length < 12 && cleanValues.length !== 11) {
            error = "CPF incorreto";
        }
        return {
            error,
            value,
        };
    },
    isCep(value) {
        let error = null;
        const cleanValues = value.replace(/\D/g, "");

        if (cleanValues.length !== 8) {
            error = "CEP incorreto";
        }

        return {
            error,
            value,
        };
    },
};
