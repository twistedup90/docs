
export function prevNext(navigation, path) {
    let prev = null;
    let next = null;
    let found = false;

    const recursiveFetch = (current) => {
        if (current.children) {
            for (const item of current.children) {
                if (next && prev) {
                    break;
                }

                if (found && !next) {
                    next = item;
                }

                if (item._path === path) {
                    found = true;
                }

                if (!found) {
                    prev = item;
                }

                recursiveFetch(item)
            }
        }
    };

    recursiveFetch(navigation.value ? navigation.value[0] : navigation[0]);

    return {prev, next};
}