module.exports = {
    date(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        const hour = date.getHours();
        const minutes = date.getMinutes();

        // return `${year}-${month}-${day}`;

        return {
            day,
            month,
            year,
            hour,
            minutes,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`,
        };
    },
    formatPrice(price) {
        return (value = Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price / 100));
    },
    formatCpfCnpj(value) {
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
    formatCep(value) {
        value = value.replace(/\D/g, "");

        if (value.length > 8) {
            value = value.slice(0, -1);
        }
        value = value.replace(/(\d{5})(\d)/, "$1-$2");
        return value;
    },
};
