import navigation from "../router/navigation";

class RouterHelper {
    GetRouterName(pathname: string): string {
        const isPathRoot = navigation.filter(elem => elem.path === pathname).length;
        if (isPathRoot) {
            return navigation.filter(elem => elem.path == pathname)[0].name;
        }
        
        const pathChildren = navigation.filter(elem => {
            return elem.children?.filter(child => child.path === pathname).length
        });

        if (pathChildren.length) {
            return pathChildren[0].children?.filter(elem => elem.path === pathname)[0].name || "";
        }

        return "";
    }
}

export default new RouterHelper();