import { updateUserRole ,findUsers, deleteUser} from "../services/user.service.js";
export const userUpdateRole = async (req, res, next) => {
    try {
        const userId =  req.user.userId
     const {user,role}= req.body 
     const userrole = await updateUserRole({userId,user,role});
     res.json(userrole)
    } catch (error) {
      next(error);
    }
  };

  export const viewAllUser = async (req, res, next) => {
    try {
        const userId =  req.user.userId
     const {sort, order, page}= req.body 
     const users = await findUsers({userId, sort, order, page});
     res.json(users)
    } catch (error) {
      next(error);
    }
  };


  export const removeUser = async (req,res,next) =>{
    try {
        const userId = req.user.userId;
        const {user}= req.body ;
       const removeUser = await deleteUser({userId,user});

       res.json(removeUser)

    } catch (error) {
        next(error)
    }
  }