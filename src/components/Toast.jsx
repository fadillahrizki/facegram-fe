import Swal from "sweetalert2";

export function showToast(message) {
   return  Swal.fire({
        toast:true,
        title:message,
        timer:2000,
        position:'top-end',
        showConfirmButton:false
    });
}