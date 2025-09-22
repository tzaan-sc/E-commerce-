<Routes>
    {/* User Routes */}
    <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        {/* Private User Routes */}
        <Route element={<PrivateRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="checkout" element={<CheckoutPage />} />
        </Route>
    </Route>

    {/* Admin Routes */}
    <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductManagement />} />
        </Route>
    </Route>

    {/* Auth Routes */}
    <Route path="/login" element={<LoginPage />} />
</Routes>