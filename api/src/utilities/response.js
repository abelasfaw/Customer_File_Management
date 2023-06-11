exports.removePassword = (user) =>{
    user = user.toObject();
    delete user.password;
    return user
}