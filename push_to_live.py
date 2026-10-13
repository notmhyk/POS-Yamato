import os
import shutil
import sys
import datetime
import subprocess

if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def run_cmd(cmd, cwd):
    try:
        res = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True, encoding='utf-8', errors='replace')
        return res.returncode, res.stdout.strip(), res.stderr.strip()
    except Exception as e:
        return 1, "", str(e)

def file_is_different(f1, f2):
    if not os.path.exists(f1) or not os.path.exists(f2):
        return True
    if os.path.getsize(f1) != os.path.getsize(f2):
        return True
    try:
        with open(f1, 'rb') as fp1, open(f2, 'rb') as fp2:
            return fp1.read() != fp2.read()
    except Exception:
        return True

def push_to_live(force=False, custom_msg=None, dry_run=False):
    root_dir = os.path.dirname(os.path.abspath(__file__))
    test_dir = os.path.join(root_dir, 'test_app')

    print("=" * 65)
    print("  🚀 PROMOTE TEST APP REVISIONS TO LIVE PRODUCTION & GITHUB")
    print("=" * 65)

    if not os.path.exists(test_dir):
        print("[ERROR] 'test_app' folder not found. Nothing to deploy.")
        return False

    core_files = ['index.html', 'app.js', 'style.css', 'manifest.json', 'sw.js']
    diff_count = 0

    print("  Checking for changes in 'test_app/'...")
    for filename in core_files:
        t_file = os.path.join(test_dir, filename)
        l_file = os.path.join(root_dir, filename)
        if not os.path.exists(t_file):
            continue
        if file_is_different(t_file, l_file):
            print(f"  [MODIFIED]  {filename}")
            diff_count += 1
        else:
            print(f"  [UNCHANGED] {filename}")

    print("=" * 65)
    if diff_count == 0:
        print("  [*] Note: Core files in 'test_app' currently match the live app.")
    else:
        print(f"  [*] Found {diff_count} modified file(s) ready to push to LIVE.")
    print("=" * 65)

    if dry_run:
        print("  [DRY-RUN] No changes applied.")
        return True

    if not force:
        try:
            choice = input("Are you sure you want to push test_app changes to LIVE? (y/N): ").strip().lower()
            if choice not in ['y', 'yes']:
                print("[!] Deployment cancelled by user.")
                return False
        except (KeyboardInterrupt, EOFError):
            print("\n[!] Deployment cancelled.")
            return False

    # Get Git commit message
    commit_msg = custom_msg
    if not commit_msg:
        if not force:
            try:
                msg_input = input("Enter commit note (Press Enter for default): ").strip()
                if msg_input:
                    commit_msg = msg_input
            except (KeyboardInterrupt, EOFError):
                pass
    if not commit_msg:
        commit_msg = f"Deploy verified revisions from test_app ({datetime.datetime.now().strftime('%Y-%m-%d %H:%M')})"

    # Step 1: Create backup of current live files
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = os.path.join(root_dir, '.backups', f"live_backup_{timestamp}")
    os.makedirs(backup_dir, exist_ok=True)
    for filename in core_files:
        src = os.path.join(root_dir, filename)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(backup_dir, filename))
    print(f"  [1/5] Safety backup saved to: .backups/live_backup_{timestamp}/")

    # Step 2: Copy test_app files to root (Live)
    for filename in core_files:
        src = os.path.join(test_dir, filename)
        dst = os.path.join(root_dir, filename)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"  [2/5] Live updated: {filename}")

    # Copy assets if test_app/assets has updates
    t_assets = os.path.join(test_dir, 'assets')
    l_assets = os.path.join(root_dir, 'assets')
    if os.path.exists(t_assets):
        shutil.copytree(t_assets, l_assets, dirs_exist_ok=True)
        print("  [2/5] Live updated: assets/ directory")

    # Step 3: Rebuild standalone offline package if script exists
    bundle_script = os.path.join(root_dir, 'bundle_offline.py')
    if os.path.exists(bundle_script):
        print("  [3/5] Rebuilding Yamato_POS_Offline.html bundle...")
        code, out, err = run_cmd(f'python "{bundle_script}"', root_dir)
        if code == 0:
            print("        Standalone offline bundle updated successfully.")
        else:
            print(f"        [!] Warning: bundle_offline.py: {err or out}")

    # Step 4: Update Android project assets if script exists
    gen_android = os.path.join(root_dir, 'generate_android_project.py')
    if os.path.exists(gen_android):
        print("  [4/5] Synchronizing Android APK project assets...")
        code, out, err = run_cmd(f'python "{gen_android}"', root_dir)
        if code == 0:
            print("        Android project synchronized successfully.")
        else:
            print(f"        [!] Warning: generate_android_project.py: {err or out}")

    # Step 5: Git add, commit, and push
    print("  [5/5] Synchronizing with Git & GitHub...")
    run_cmd('git add .', root_dir)
    code, out, err = run_cmd(f'git commit -m "{commit_msg}"', root_dir)
    if "nothing to commit" in out or "nothing to commit" in err:
        print("        No git diff detected to commit.")
    else:
        print(f"        Committed to git: \"{commit_msg}\"")

    print("        Pushing to GitHub (origin/main)...")
    code, out, err = run_cmd('git push origin main', root_dir)
    if code == 0:
        print("        Pushed to GitHub successfully!")
    else:
        print(f"        [!] Note: Git push message: {err or out}")
        print("        If offline, you can push later with: git push origin main")

    print("=" * 65)
    print("  ✅ SUCCESS: LIVE APP UPDATED & READY!")
    print("=" * 65)
    print("  * Changes from 'test_app' are now LIVE in the main POS.")
    print("  * You can start the live POS anytime with: run_app.bat")
    print("=" * 65)
    return True

if __name__ == '__main__':
    force_flag = '--force' in sys.argv or '--auto' in sys.argv
    dry_run_flag = '--dry-run' in sys.argv or '--check' in sys.argv
    msg = None
    for arg in sys.argv[1:]:
        if arg.startswith('--msg='):
            msg = arg.split('=', 1)[1]
    push_to_live(force=force_flag, custom_msg=msg, dry_run=dry_run_flag)
