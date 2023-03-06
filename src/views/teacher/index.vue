<template>
    <el-container style="height: 500px; border: 1px solid #eee">
        <el-header>
            <commonHead></commonHead>
        </el-header>
        <el-container>
            <sidebar type="teacher"></sidebar>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>

    </el-container>
</template>

<script>
import commonHead from "@/components/common/Head.vue"
import sidebar from "@/components/common/SideBar.vue"

export default {
    components: {
        commonHead,
        sidebar
    }
}
</script>

<style>
.el-header {
    background-color: #eef3ff;
    color: #333;
}
</style>