class Permissions {
  //Dashboard Permissions
  static viewDashboard = 'PERMISSION_DASHBOARD_VIEW';

  //Category Permissions
  static listCategory = 'PERMISSION_CATEGORY_LIST';
  static viewCategory = 'PERMISSION_CATEGORY_VIEW';
  static addCategory = 'PERMISSION_CATEGORY_ADD';
  static editCategory = 'PERMISSION_CATEGORY_EDIT';
  static deleteCategory = 'PERMISSION_CATEGORY_DELETE';

  //Claim Status Permissions
  static listClaimStatus = 'PERMISSION_CLAIM_STATUS_LIST';
  static viewClaimStatus = 'PERMISSION_CLAIM_STATUS_VIEW';
  static addClaimstatus = 'PERMISSION_CLAIM_STATUS_ADD';
  static editClaimStatus = 'PERMISSION_CLAIM_STATUS_EDIT';
  static deleteClaimStatus = 'PERMISSION_CLAIM_STATUS_DELETE';

  //Department Permissions
  static listDepartment = 'PERMISSION_DEPARTMENT_LIST';
  static viewDepartment = 'PERMISSION_DEPARTMENT_VIEW';
  static addDepartment = 'PERMISSION_DEPARTMENT_ADD';
  static editDepartment = 'PERMISSION_DEPARTMENT_EDIT';
  static deleteDepartment = 'PERMISSION_DEPARTMENT_DELETE';

  //User Role Permissions
  static listUserRole = 'PERMISSION_USER_ROLE_LIST';
  static viewUserRole = 'PERMISSION_USER_ROLE_VIEW';
  static addUserRole = 'PERMISSION_USER_ROLE_ADD';
  static editUserRole = 'PERMISSION_USER_ROLE_EDIT';
  static deleteUserRole = 'PERMISSION_USER_ROLE_DELETE';

  //Permission Permissions
  static viewPermission = 'PERMISSION_PERMISSION_VIEW';
  static editPermission = 'PERMISSION_PERMISSION_EDIT';
  static listPermission = 'PERMISSION_PERMISSION_LIST';
  static addPermission = 'PERMISSION_PERMISSION_ADD';
  static deletePermission = 'PERMISSION_PERMISSION_DELETE';

  // User Permissions
  static viewUser = 'PERMISSION_USER_VIEW';
  static editUser = 'PERMISSION_USER_EDIT';
  static listUser = 'PERMISSION_USER_LIST';
  static addUser = 'PERMISSION_USER_ADD';
  static deleteUser = 'PERMISSION_USER_DELETE';

  // Group Permissions
  static viewGroup = 'PERMISSION_GROUP_VIEW';
  static editGroup = 'PERMISSION_GROUP_EDIT';
  static listGroup = 'PERMISSION_GROUP_LIST';
  static addGroup = 'PERMISSION_GROUP_ADD';
  static deleteGroup = 'PERMISSION_GROUP_DELETE';
  static submitGroup = 'PERMISSION_GROUP_SUBMIT';

  // Claim Permissions
  static viewClaim = 'PERMISSION_CLAIM_VIEW';
  static editClaim = 'PERMISSION_CLAIM_EDIT';
  static listClaim = 'PERMISSION_CLAIM_LIST';
  static addClaim = 'PERMISSION_CLAIM_ADD';
  static deleteClaim = 'PERMISSION_CLAIM_DELETE';
  static submitClaim = 'PERMISSION_CLAIM_SUBMIT';

  // Profile Permissions
  static viewProfile = 'PERMISSION_PROFILE_VIEW';

  //Business Logic Permissions

  //Group after submit Permissions
  static changeGroupStatus = 'PERMISSION_GROUP_CHANGE_STATUS';
  static editGroupAfterSubmit = 'PERMISSION_GROUP_EDIT_AFTER_SUBMIT';
  static changeGroupAmount = 'PERMISSION_GROUP_CHANGE_AMOUNT';

  //Claim after submit Permissions
  static changeClaimStatus = 'PERMISSION_CLAIM_CHANGE_STATUS';
  static editClaimAfterSubmit = 'PERMISSION_CLAIM_EDIT_AFTER_SUBMIT';
  static changeClaimAmount = 'PERMISSION_CLAIM_CHANGE_AMOUNT';
}

export default Permissions;
