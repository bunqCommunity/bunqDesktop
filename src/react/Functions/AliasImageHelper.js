export const getAliasImageUuid = alias => {
    if (alias.avatar && alias.avatar.image && alias.avatar.image[0]) {
        return alias.avatar.image[0].attachment_public_uuid;
    }

    return false;
};
