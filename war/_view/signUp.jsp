<!DOCTYPE html>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<html>
	<head>
		<title>New User Sign Up!</title>
		<style type="text/css">
		.error {
			color: red;
		}
		
		td.label {
			text-align: right;
		}
		</style>
	</head>
    
	<body>
		<c:if test="${! empty errorMessage}">
			<div class="error">${errorMessage}</div>
		</c:if>
	
		<form action="${pageContext.servletContext.contextPath}/signUp" method="post">
			<table>
				<tr>
					<td class="label">Username:</td>
					<td><input type="text" name="username" size="12" value="${signUp.username}" /></td>
				</tr>
				<tr>
					<td class="label">Password:</td>
					<td><input type="text" name="password" size="12" value="${signUp.password}" /></td>
				</tr>
                <tr>
					<td class="label">Password:</td>
					<td><input type="text" name="passwordCheck" size="12" value="${signUp.passwordCheck}" /></td>
				</tr>
                
			</table>
			<input type="Submit" name="submit" value="Login!">
		</form>
	</body>
</html>