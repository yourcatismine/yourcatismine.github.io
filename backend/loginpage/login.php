<?php
session_start();

include '../methods/database.php';

$error_message = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['username'], $_POST['password'])) {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    
    if (empty($username) || empty($password)) {
        $error_message = "Username and password are required.";
    } else {
        try {
            $stmt = $conn->prepare("SELECT username, password, role FROM users WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                
                if ($user['password'] === $password) {
                    $_SESSION['username'] = $username;
                    $_SESSION['last_activity'] = time();
                    $_SESSION['role'] = $user['role']; 
                    
                    header("Location: ../adminpage/adminpage.php");
                    exit(); // Important: Stop script execution after redirect
                } else {
                    $error_message = "Invalid password.";
                }
            } else {
                $error_message = "Username not found.";
            }
            
            $stmt->close();
            
        } catch (Exception $e) {
            $error_message = "Database error occurred.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="../styles/style.css">
    <title>Admin Panel</title>
</head>

<body>

    <div class="container" id="container">
        <div class="form-container sign-in">
            <form method="POST" action="">
                <h1>Sign In</h1>
                <input type="text" placeholder="Username" id="username" name="username" value="<?php echo isset($_POST['username']) ? htmlspecialchars($_POST['username']) : ''; ?>" required>
                <input type="password" placeholder="Password" id="password" name="password" required>
                <?php if (!empty($error_message)): ?>
                <div class="error-message">
                    <?php echo htmlspecialchars($error_message); ?>
                </div>
                <?php endif; ?>
                <button type="submit">Log in</button>
            </form>
        </div>
        <div class="toggle-container">
            <div class="toggle">
                <div class="toggle-panel toggle-right">
                    <h1>Hello, Admin!</h1>
                    <p>Welcome to my portfolio, this is the Admin Panel Area.</p>
                </div>
            </div>
        </div>
    </div>

    
</body>

</html>