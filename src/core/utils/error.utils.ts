class ErrorUtils {
    defaultError = "Houve um erro interno, tente novamente em instantes.";
    get(err: any) {
        if (!err) return this.defaultError;
        if (err instanceof String) return err;
        return err.response?.data?.errors ? err.response.data.errors[0] : this.defaultError;
    }
}

export default new ErrorUtils();